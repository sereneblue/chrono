<template>
  <div class="text-center">
    <v-bottom-sheet scrollable v-model="open">
      <v-card>
        <v-card-title>
          Visits for {{ historyDate }}
          <v-text-field :value="searchQuery" @change="q => (searchQuery = q)" @keyup.enter="search" single-line :color="themeColor" class="ml-4" label="Search..." />
        </v-card-title>
        <v-divider />

        <v-card-text>
          <v-list id="dayHistory" dense two-line style="max-height: 50vh; overflow-y: auto;">
            <v-list-item dense v-for="h in filteredHistory" @click="openModal(h.url)" :key="h.visitTime">
              <v-list-item-avatar>
                {{ h.visitTime | to24Hours }}
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-regular" style="font-size: 20px">{{ h.title ? h.title : '-- No title --' }}</v-list-item-title>
                <v-list-item-subtitle class="mt-2" style="font-size: 16px">{{ h.url }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="i in fillLength" />
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-snackbar v-model="snackbar" :timeout="1500" top>
      URL copied to clipboard!
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline justify-center">Choose an action for this URL</v-card-title>
        <v-card-text>
          <div style="padding-bottom: 10px; font-size: 18px;">{{ url.length > 100 ? url.slice(0, 100) + '...' : url }}</div>
          <v-btn @click="openLink" :color="themeColor" block>
            Open in new tab
          </v-btn>
          <v-btn @click="copy" class="my-2" :color="themeColor" block>
            Copy to clipboard
          </v-btn>
          <v-btn @click="remove" :color="themeColor" block>
            Delete from history
          </v-btn>
          <p v-if="showMessage" class="text-center">Successfully removed URL from history!</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'HistorySheet',
  data() {
    return {
      dialog: false,
      query: '',
      showMessage: false,
      snackbar: false,
      url: '',
    };
  },
  computed: {
    fillLength() {
      let remaining = 8 - this.filteredHistory.length;
      return remaining >= 0 ? remaining : 0;
    },
    filteredHistory() {
      this.$nextTick(() => {
        let el = document.querySelector('#dayHistory');
        if (el) el.scrollTop = 0;
      });

      let query = this.query;

      if (query) {
        let tmpHistory = [...this.history];
        let filters = [];

        let negation = query.match(/(?:^|\W)\-(\w+)(?!\w)/g);
        if (negation) {
          for (var i = 0; i < negation.length; i++) {
            filters.push(negation[i].replace(/\s?-/g, '').toLowerCase());

            // remove filter from query
            query = query.replace(negation[i], '');
          }
        }

        query = query.replace(/\s-$/, '').trim();
        tmpHistory = tmpHistory.filter(h => h.url.toLowerCase().indexOf(query) > -1 || h.title.toLowerCase().indexOf(query) > -1);

        for (var i = 0; i < filters.length; i++) {
          tmpHistory = tmpHistory.filter(h => {
            if (h.url.toLowerCase().indexOf(filters[i]) > -1) return false;
            if (h.title.toLowerCase().indexOf(filters[i]) > -1) return false;

            return true;
          });
        }

        return tmpHistory;
      } else {
        return this.history;
      }
    },
    history() {
      if (!this.$store.state.viewDay) return [];

      if (this.$store.state.visits[this.$store.state.viewDay].visits) {
        return this.$store.state.visits[this.$store.state.viewDay].visits;
      }

      return [];
    },
    historyDate() {
      return this.$store.state.viewDay ? this.$moment(this.$store.state.viewDay).format('MMMM DD, YYYY') : '';
    },
    open: {
      get() {
        if (this.$store.state.historyOpen) {
          this.query = '';
          this.$nextTick(() => {
            document.querySelector('#dayHistory').scrollTop = 0;
          });
        }
        return this.$store.state.historyOpen;
      },
      set(value) {
        this.$store.dispatch('updateHistoryOpen', value);
      },
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
  },
  filters: {
    to24Hours(ms) {
      let date = new Date(ms);
      return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
    },
  },
  methods: {
    copy() {
      this.$copy(this.url);
      this.snackbar = true;

      setTimeout(() => {
        this.dialog = false;
      }, 1000);
    },
    openLink() {
      browser.tabs.create({ active: false, url: this.url });

      setTimeout(() => {
        this.dialog = false;
      }, 500);
    },
    openModal(url) {
      this.dialog = true;
      this.url = url;
    },
    remove() {
      browser.history.deleteUrl({ url: this.url });
      this.$store.dispatch('removeHistory', this.url);
      this.showMessage = true;

      setTimeout(() => {
        this.dialog = false;
        this.showMessage = false;
      }, 1500);
    },
    search() {
      this.query = this.searchQuery;
    },
  },
};
</script>
