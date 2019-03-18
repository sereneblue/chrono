<template>
  <v-container fluid grid-list-md text-lg-center>
    <v-layout row wrap>
      <v-flex lg4>
        <v-card>
          <v-list subheader>
            <v-subheader>Top Domains</v-subheader>
            <v-list-tile
              v-for="domain in topDomains"
              :key="domain[0]"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ domain[0] }} </v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action v-if="domain[1]">
                <v-chip label>{{ domain[1] }} visits</v-chip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex lg8>
        <v-card min-height="100%">
          <v-subheader>Browsing History Trend</v-subheader>
          <VisitsTrend :data="visits"/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6>
        <v-card min-height="100%">
          <v-subheader>Day of Week</v-subheader>
          <DayOfWeekTrend :data="dayOfWeek" />
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card>
          <v-subheader>Time of Day (hour)</v-subheader>
          <TimeOfDayTrend :data="timeOfDay" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import VisitsTrend from './components/VisitsTrend.vue';
import DayOfWeekTrend from './components/DayOfWeekTrend.vue';
import TimeOfDayTrend from './components/TimeOfDayTrend.vue';

var moment = require('moment');

export default {
  name: 'StatsView',
  components: {
    VisitsTrend,
    DayOfWeekTrend,
    TimeOfDayTrend
  },
  async created() {
    await this.calculateStats(90);
  },
  data() {
    return {
      dayOfWeek: [],
      timeOfDay: [],
      topDomains: [],
      visits: []
    }
  },
  methods: {
    async calculateStats(duration) {
      let d = moment().subtract(duration, 'day').startOf('day');
      let count;
      let dow = [0, 0, 0, 0, 0, 0, 0];
      let tod = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      let visits = await browser.history.search({
        text: "",
        startTime: d.valueOf(),
        endTime: moment().valueOf(),
        maxResults: 1000000000
      });

      let index = visits.length - 1;
      let domains = {};
      let visitTime = null;

      for (var i = 0; i <= duration; i++) {
        count = 0;

        while (index > -1) {
          // get top domain
          let domain = new URL(visits[index].url).hostname;
          if (domain && domains[domain]) {
            domains[domain]++;
          } else {
            domains[domain] = 1;
          }

          // get day of week & time of day
          visitTime = moment(visits[index].lastVisitTime);
          dow[visitTime.day()]++;
          tod[visitTime.hour()]++;

          // get visit count
          if (d.startOf('day').valueOf() > visits[index].lastVisitTime) {
            index--;
            continue;
          }

          if (visits[index].lastVisitTime <= d.endOf('day').valueOf()) {
            index--;
            count++;
          } else {
            break;
          }
        }

        this.visits.push([d.format('L'), count]);
        d.add(1, 'day');
      }

      let domainList = [];
      for (var domain in domains) {
        domainList.push([domain, domains[domain]]);
      }

      domainList.sort((a, b) => { return b[1] - a[1]});
      this.topDomains = domainList.slice(0, 10);
      if (domainList.length < 10) {
        for (var i = domainList.length - 1; i < 10; i++) {
          this.topDomains.push(["", 0]);
        }
      }
      this.dayOfWeek = dow;
      this.timeOfDay = tod;
    }
  }
};
</script>

<style scoped>
</style>
