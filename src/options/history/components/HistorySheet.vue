<template>
  <div class="text-xs-center">
    <v-bottom-sheet scrollable v-model="open">
      <v-card>
        <v-card-title>Visits for {{ historyDate }}</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-list id="dayHistory" dense two-line style="max-height: 50vh; overflow-y: auto;">
            <v-list-tile 
              v-for="h in history"
              @click="openModal(h.url)"
              >
              <v-list-tile-avatar size="50">
                {{ h.visitTime | to24Hours }}
              </v-list-tile-avatar>
              
              <v-list-tile-content>
                <v-list-tile-title class="subheading">{{ h.title ? h.title : "-- blank title --" }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ h.url }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-snackbar v-model="snackbar" :timeout="1500" top>
      URL copied to clipboard!
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline justify-center">Choose an action for this URL</v-card-title>
        <v-card-text>
          <div style="padding-bottom: 10px;">{{ url.length > 100 ? url.slice(0, 100) + '...' : url }}</div>
          <v-btn
            @click="openLink"
            :color="themeColor"
            block
          >
            Open in new tab
          </v-btn>
          <v-btn
            @click="copy"
            :color="themeColor"
            block
          >
            Copy to clipboard
          </v-btn>
          <v-btn
            @click="remove"
            :color="themeColor"
            block
          >
            Delete from history
          </v-btn>
          <p v-if="showMessage" class="text-xs-center">Successfully removed URL from history!</p>
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
        showMessage: false,
        snackbar: false,
        url: ""
      }
    },
    computed: {
      history() {
        if (!this.$store.state.viewDay) return [];
        
        if (this.$store.state.visits[this.$store.state.viewDay].visits) {
          return this.$store.state.visits[this.$store.state.viewDay].visits;
        }

        return [];
      },
      historyDate() {
        return this.$store.state.viewDay ? this.$moment(this.$store.state.viewDay).format('MMMM DD, YYYY') : "";
      },
      open: {
        get() {
          if (this.$store.state.historyOpen) {
            this.$nextTick(() => {
              document.querySelector('#dayHistory').scrollTop = 0;
            });
          }
          return this.$store.state.historyOpen;
        },
        set(value) {
          this.$store.dispatch('updateHistoryOpen', value);
        }
      },
      themeColor() {
        return this.$store.state.themeColor;
      }
    },
    filters: {
      to24Hours(ms) {
        let date = new Date(ms);
        return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
      }
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
        browser.tabs.create({ active: false, url : this.url });

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
      }
    }
  }
</script>