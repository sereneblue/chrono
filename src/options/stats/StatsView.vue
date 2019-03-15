<template>
</template>

<script>
var moment = require('moment');

export default {
  name: 'StatsView',
  async created() {
    await this.calculateStats(90);
  },
  data() {
    return {
      topDomains: [],
      visits: []
    }
  },
  methods: {
    async calculateStats(duration) {
      let d = moment().subtract(duration, 'day').startOf('day');
      let count;

      let visits = await browser.history.search({
        text: "",
        startTime: d.valueOf(),
        endTime: moment().valueOf(),
        maxResults: 1000000000
      });

      let index = visits.length - 1;
      let domains = {};

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
    }
  }
};
</script>

<style scoped>
</style>
