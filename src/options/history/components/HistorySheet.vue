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
              @click="openLink(h.url)"
              >
              <v-list-tile-avatar size="50">
                {{ h.visitTime | to24Hours }}
              </v-list-tile-avatar>
              
              <v-list-tile-content>
                <v-list-tile-title class="subheading">{{ h.title ? h.title : "-- blank title --" }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ h.url }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn @click.stop="remove(h.url)" icon ripple>
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
  export default {
    name: 'HistorySheet',
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
      }
    },
    filters: {
      to24Hours(ms) {
        let date = new Date(ms);
        return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
      }
    },
    methods: {
      openLink(url) {
        browser.tabs.create({ active: false, url : url});
      },
      remove(url) {
        browser.history.deleteUrl({ url: url });
        this.$store.dispatch('removeHistory', url);
      }
    }
  }
</script>