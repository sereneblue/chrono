<template>
  <v-container fill-height fluid grid-list-md text-lg-center>
    <v-layout align-center wrap>
      <v-flex
        sm4
        xs12
        class="text-sm-left text-xs-center"
      >
        <v-btn @click="prev()">
          <v-icon
            left
          >
            keyboard_arrow_left
          </v-icon>
          Prev
        </v-btn>
      </v-flex>
      <v-flex
        sm4
        xs12
        class="headline text-xs-center"
      >
        {{ month }}
      </v-flex>
      <v-flex
        sm4
        xs12
        class="text-sm-right text-xs-center"
      >
        <v-btn>
          <v-icon>
            delete
          </v-icon>
        </v-btn>
        <v-btn @click="next()" :disabled="isDisabled">
          Next
          <v-icon
            right
          >
            keyboard_arrow_right
          </v-icon>
        </v-btn>
      </v-flex>
      <v-flex
        xs12
        class="mb-3"
      >
        <v-sheet height="80vh">
          <HistoryCalendar :visits="visits" ref="historycal" />
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HistoryCalendar from './components/HistoryCalendar.vue';

export default {  
  name: 'HistoryView',
  components: {
    HistoryCalendar
  },
  data() {
    return {
      currentMonth: this.$moment().format("MMMM YYYY"),
      searchVisits: [],
      visits: {}
    }
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
      return this.$moment(this.start).format("MMMM YYYY");
    },
    start() {
      return this.$store.state.month;
    }
  },
  methods: {
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
      let events = {};
      let dayEvents = {};

      let visits = await browser.history.search({
        text: "",
        startTime: monthStart,
        endTime: monthEnd,
        maxResults: 1000000000
      });

      for (var i = visits.length - 1; i >= 0; i--) {
        // check if visit date falls within search range 
        if (monthStart <= visits[i].lastVisitTime &&
            visits[i].lastVisitTime <= monthEnd) {
          date.setTime(visits[i].lastVisitTime);
          d = this.getDate(date);

          if (events[d]) {
            events[d].pages++;
            dayEvents[d].push(visits[i]);
          } else {
            events[d] = {
              pages: 1,
              views: 0,
            };
            dayEvents[d] = [visits[i]];
          }
        }

        urlVisits = await browser.history.getVisits({
          url: visits[i].url
        });

        for (var j = 0; j < urlVisits.length; j++) {
          if (monthStart <= urlVisits[j].visitTime &&
              urlVisits[j].visitTime <= monthEnd) {

            date.setTime(urlVisits[j].visitTime);
            d = this.getDate(date);

            if (events[d]) {
              events[d].views++;
            } else {
              events[d] = {
                pages: 1,
                views: 1
              };
            }
          } else {
            break;
          }
        }
      }

      let v = Object.keys(events).map(e => [e, events[e].views])
      v.sort(function(a, b) {return a[1] - b[1] });

      if (v.length > 0) {
        for (var i = 0; i < v.length; i++) {
          bucket = parseInt(( v[i][1] - v[0][1]) * 3 / ( v[v.length - 1][1] - v[0][1] ));

          if (bucket == 0) {
            events[v[i][0]].bucket = "low";
          } else if (bucket == 1) {
            events[v[i][0]].bucket = "med";
          } else {
            events[v[i][0]].bucket = "high";
          }
        }
      }

      for (var i in dayEvents) {
        dayEvents[i].sort(function(a, b) {return b.lastVisitTime - a.lastVisitTime });
      }

      this.visits = events;
      this.$store.dispatch('updateVisits', dayEvents);
    },
    async next() {
      this.$refs.historycal.$refs.calendar.next();
      await this.getVisits();
    },
    async prev() {
      this.$refs.historycal.$refs.calendar.prev();
      await this.getVisits();
    }
  }
};
</script>