<template>
  <div>
    <div class="ranges text-xs-center">
      <span @click="selectRange('1y')" :class="{'active' : range == '1y', 'body-2': true }">1 year</span> |
      <span @click="selectRange('6m')" :class="{'active' : range == '6m', 'body-2': true }">6 months</span> |
      <span @click="selectRange('3m')" :class="{'active' : range == '3m', 'body-2': true }">3 months</span> |
      <span @click="selectRange('1m')" :class="{'active' : range == '1m', 'body-2': true }">1 month</span> 
    </div>
    <v-container fluid grid-list-md text-lg-center>
      <v-layout row wrap>
        <v-flex lg4>
          <v-card>
            <v-list subheader>
              <v-subheader>Top Domains</v-subheader>
              <v-list-tile v-for="domain in topDomains">
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
            <v-subheader>Browsing History (Past 3 Months)</v-subheader>
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
  </div>
</template>

<script>
import VisitsTrend from './components/VisitsTrend.vue';
import DayOfWeekTrend from './components/DayOfWeekTrend.vue';
import TimeOfDayTrend from './components/TimeOfDayTrend.vue';

export default {
  name: 'StatsView',
  components: {
    VisitsTrend,
    DayOfWeekTrend,
    TimeOfDayTrend
  },
  async created() {
    await this.selectRange(this.range);
  },
  data() {
    return {
      dayOfWeek: [],
      rangeValues: {
        '1y': 365,
        '6m': 180,
        '3m': 90,
        '1m': 30
      },
      timeOfDay: [],
      topDomains: [],
      visits: []
    }
  },
  computed: {
    range() {
      return this.$store.state.statsRange;
    }
  },
  methods: {
    async calculateStats(duration) {
      let d = this.$moment().subtract(duration, 'day').startOf('day');
      let count;
      let dow = [0, 0, 0, 0, 0, 0, 0];
      let tod = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let tmpVisits = [];

      let visits = await browser.history.search({
        text: "",
        startTime: d.valueOf(),
        endTime: this.$moment().valueOf(),
        maxResults: 1000000000
      });

      let index = visits.length - 1;
      let domains = {};
      let visitTime = null;

      for (var i = 0; i <= duration; i++) {
        count = 0;

        while (index > -1) {
          // get visit count
          if (d.startOf('day').valueOf() > visits[index].lastVisitTime) {
            index--;
            continue;
          }

          if (visits[index].lastVisitTime <= d.endOf('day').valueOf()) {
            // get top domain
            let domain = new URL(visits[index].url).hostname;
            if (domain && domains[domain]) {
              domains[domain]++;
            } else {
              domains[domain] = 1;
            }

            // get day of week & time of day
            visitTime = this.$moment(visits[index].lastVisitTime);
            dow[visitTime.day()]++;
            tod[visitTime.hour()]++;

            index--;
            count++;
          } else {
            break;
          }
        }

        tmpVisits.push([d.format('L'), count]);
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
      this.visits = tmpVisits;
    },
    selectRange(range) {
      this.calculateStats(this.rangeValues[range]);
      this.$store.dispatch('updateRange', range);
    }
  }
};
</script>

<style lang="scss" scoped>
  .theme--light .ranges {
    color: rgba(0, 0, 0, 0.5);

    & span.active {
      color: black;
    }
  }

  .theme--dark .ranges {
    color: rgba(255, 255, 255, 0.5);

    & span.active {
      color: white;
    }
  }

  .ranges span {
    cursor: pointer;
    padding: 0px 10px;
  }
</style>
