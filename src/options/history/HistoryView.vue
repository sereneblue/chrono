<template>
  <v-container fluid>
    <v-row>
      <v-col lg="4" class="text-left">
        <v-btn @click="move('prev')">
          <v-icon left>
            mdi-chevron-left
          </v-icon>
          Prev
        </v-btn>
      </v-col>
      <v-col lg="4" class="headline text-center">
        {{ month }}
      </v-col>
      <v-col lg="4" class="text-right">
        <v-progress-circular v-if="loadingVisits" indeterminate :color="themeColor" :width="5"></v-progress-circular>
        <v-btn v-show="!isDisabled" @click="setToday">
          Today
        </v-btn>
        <v-btn @click="clearHistory.dialog = true">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn @click="move('next')" :disabled="isDisabled">
          Next
          <v-icon right>
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </v-col>
      <v-col sm="12" class="mb-3">
        <v-sheet height="80vh">
          <HistoryCalendar ref="historycal" />
        </v-sheet>
      </v-col>
    </v-row>
    <HistorySheet />
    <v-dialog v-model="clearHistory.dialog" max-width="400">
      <v-card>
        <v-card-title class="headline justify-center">Clear History</v-card-title>
        <v-card-text>
          <v-menu v-model="clearHistory.start.menu" :close-on-content-click="false" nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                @change="input => (clearHistory.start.date = input)"
                :value="clearHistory.start.date"
                :color="themeColor"
                label="Start date"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker v-model="clearHistory.start.date" @input="clearHistory.start.menu = false" :color="themeColor" :max="getDate(new Date())" no-title scrollable>
            </v-date-picker>
          </v-menu>
          <v-menu v-model="clearHistory.end.menu" :close-on-content-click="false" nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                @change="input => (clearHistory.end.date = input)"
                :value="clearHistory.end.date"
                :color="themeColor"
                label="End date"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker v-model="clearHistory.end.date" @input="clearHistory.end.menu = false" :color="themeColor" :max="getDate(new Date())" no-title scrollable>
            </v-date-picker>
          </v-menu>
          <v-container>
            <v-row>
              <v-col lg="6">
                <v-btn @click="clearBrowsingHistory('all')" color="warning" block>
                  Clear All
                </v-btn>
              </v-col>
              <v-col lg="6">
                <v-btn @click="clearBrowsingHistory" color="info" block>
                  Clear Range
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <p v-if="clearHistory.showMessage" class="text-center">Successfully cleared history!</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import HistoryCalendar from './components/HistoryCalendar.vue';
import HistorySheet from './components/HistorySheet.vue';

export default {
  name: 'HistoryView',
  components: {
    HistoryCalendar,
    HistorySheet,
  },
  data() {
    return {
      clearHistory: {
        dialog: false,
        showMessage: false,
        end: {
          date: this.getDate(new Date()),
          menu: false,
        },
        start: {
          date: this.getDate(new Date()),
          menu: false,
        },
      },
      currentMonth: this.$moment().format('MMMM YYYY'),
      loadingVisits: true,
    };
  },
  async created() {
    this.$store.dispatch('changeMonth', this.$moment().format('YYYY-MM-DD'));
    await this.getVisits();
  },
  computed: {
    isDisabled() {
      return this.currentMonth == this.month;
    },
    month() {
      return this.$moment(this.start).format('MMMM YYYY');
    },
    start() {
      return this.$store.state.month;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
  },
  methods: {
    async clearBrowsingHistory(allHistory) {
      if (allHistory == 'all') {
        await browser.history.deleteAll();
      } else {
        let startTime = this.$moment(this.clearHistory.start.date)
          .startOf('day')
          .valueOf();
        let endTime = this.$moment(this.clearHistory.end.date)
          .endOf('day')
          .valueOf();

        await browser.history.deleteRange({
          startTime,
          endTime,
        });
      }

      this.clearHistory.showMessage = true;

      setTimeout(() => {
        this.clearHistory.dialog = false;
        this.clearHistory.showMessage = false;
      }, 2000);
    },
    getDate(d) {
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    async getVisits() {
      let m = this.$moment(this.start);
      let monthStart = m.startOf('month').valueOf();
      let monthEnd = m.endOf('month').valueOf();

      let bucket = null;
      let d = null;
      let date = new Date(0);
      let urlVisits = null;
      let events = [];
      let dailyVisits = {};

      let visits = await browser.history.search({
        text: '',
        startTime: monthStart,
        endTime: monthEnd,
        maxResults: 1000000000,
      });

      for (var i = visits.length - 1; i >= 0; i--) {
        urlVisits = await browser.history.getVisits({
          url: visits[i].url,
        });

        for (var j = 0; j < urlVisits.length; j++) {
          if (monthStart <= urlVisits[j].visitTime && urlVisits[j].visitTime <= monthEnd && urlVisits[j].transition != 'reload') {
            events.push({
              url: visits[i].url,
              title: visits[i].title,
              visitTime: urlVisits[j].visitTime,
            });
          } else {
            break;
          }
        }
      }

      // process visits
      for (var i = 0; i < events.length; i++) {
        date.setTime(events[i].visitTime);
        d = this.getDate(date);

        if (dailyVisits[d]) {
          // check if unique url
          if (!dailyVisits[d].visits.find(v => v.url == events[i].url)) {
            dailyVisits[d].pages++;
          }
          dailyVisits[d].views++;
          dailyVisits[d].visits.push(events[i]);
        } else {
          dailyVisits[d] = {
            pages: 1,
            views: 1,
            visits: [events[i]],
          };
        }
      }

      let v = Object.keys(dailyVisits).map(e => [e, dailyVisits[e].views]);
      v.sort(function(a, b) {
        return a[1] - b[1];
      });

      for (var i = 0; i < v.length; i++) {
        bucket = parseInt(((v[i][1] - v[0][1]) * 3) / (v[v.length - 1][1] - v[0][1]));

        if (bucket == 0) {
          dailyVisits[v[i][0]].bucket = 'low';
        } else if (bucket == 1) {
          dailyVisits[v[i][0]].bucket = 'med';
        } else {
          dailyVisits[v[i][0]].bucket = 'high';
        }
      }

      for (var i in dailyVisits) {
        dailyVisits[i].visits.sort(function(a, b) {
          return b.visitTime - a.visitTime;
        });
      }

      this.loadingVisits = false;
      this.$store.dispatch('updateVisits', dailyVisits);
    },
    async move(dir) {
      this.loadingVisits = true;
      this.$refs.historycal.$refs.calendar[dir]();
      await this.getVisits();
    },
    async setToday() {
      let today = this.$moment().format('YYYY-MM-DD');
      this.$store.dispatch('changeMonth', today);
      await this.getVisits();
      this.$refs.historycal.getDayHistory({ date: today });
    },
  },
};
</script>
