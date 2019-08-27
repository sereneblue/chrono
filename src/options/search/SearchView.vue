<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col sm="12">
          <v-text-field :value="query" @change="q => (query = q)" @keyup.enter="search" :color="themeColor" :error-messages="errorMessage" label="Search" filled />
        </v-col>
        <v-col class="py-0">
          <v-checkbox v-model="groupByDomain" :color="themeColor" label="Group results by domain" />
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12">
          <div v-if="results.length > 0 && !groupByDomain">
            <v-subheader>{{ results.length }} {{ results.length == 1 ? 'result' : 'results' }} found</v-subheader>
            <v-list two-line>
              <v-list-item v-for="result in results" @click="openModal(result.url)" :key="results.id">
                <v-list-item-avatar>
                  {{ result.lastVisitTime | formatDate }}
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="subheading">{{ result.title ? result.title : '-- No title --' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ result.url }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <div v-else-if="results.length > 0 && groupByDomain">
            <v-subheader>{{ resultsText }}</v-subheader>
            <v-list v-for="group in groupedResults" two-line subheader>
              <v-layout justify-space-between>
                <v-subheader class="font-weight-medium" style="font-size: 18px;">
                  {{ group.host }}
                  <v-btn v-if="group.host" @click="openBrowsingDataModal(group.host)" :color="themeColor" class="ml-2" small style="align-self: center;">
                    Forget
                  </v-btn>
                </v-subheader>
              </v-layout>
              <v-list-item v-for="result in group.results" @click="openModal(result.url)" :key="result.id">
                <v-list-item-avatar>
                  {{ result.lastVisitTime | formatDate }}
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="subheading">{{ result.title ? result.title : '-- No title --' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ result.url }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
          </div>
          <div v-else-if="noResults">
            <v-subheader>No results found</v-subheader>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="1500" top>
      URL copied to clipboard!
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline justify-center">Choose an action for this URL</v-card-title>
        <v-card-text>
          <div style="padding-bottom: 10px;">{{ url.length > 100 ? url.slice(0, 100) + '...' : url }}</div>
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
    <v-dialog v-model="browsingData.dialog" max-width="400">
      <v-card>
        <v-card-title class="headline justify-center">Choose an action for this site</v-card-title>
        <v-card-text>
          <div style="padding-bottom: 10px; font-size: 18px;">{{ host.length > 100 ? host.slice(0, 100) + '...' : host }}</div>
          <v-checkbox v-model="browsingData.cookies" :color="themeColor" label="Delete cookies" block></v-checkbox>
          <v-checkbox v-model="browsingData.history" :color="themeColor" label="Delete history" block></v-checkbox>

          <v-btn @click="deleteBrowsingData" :loading="loading" :color="themeColor" block>
            Clear browsing data
          </v-btn>
          <p v-if="showMessage" class="text-center">Successfully cleared browsing data!</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'SearchView',
  data() {
    return {
      browsingData: {
        cookies: false,
        dialog: false,
        history: false,
      },
      dialog: false,
      host: '',
      errorMessage: '',
      groupedResults: [],
      loading: false,
      noResults: false,
      query: '',
      results: [],
      showMessage: false,
      snackbar: false,
      url: '',
    };
  },
  computed: {
    groupByDomain: {
      get() {
        return this.$store.state.groupByDomain;
      },
      set(value) {
        this.$store.dispatch('updateGroupByDomain', value);
      },
    },
    resultsText() {
      return `${this.results.length} ${this.groupedResults.length == 1 ? 'result' : 'results'}, ${this.groupedResults.length} ${
        this.groupedResults.length == 1 ? 'domain' : 'domains'
      } found`;
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
  },
  filters: {
    formatDate(ms) {
      let d = new Date(ms);
      return `${('0' + (d.getMonth() + 1)).slice(-2)}/${('0' + d.getDate()).slice(-2)}`;
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
    async deleteBrowsingData() {
      this.loading = true;
      if (this.browsingData.cookies) {
        await browser.browsingData.removeCookies({
          hostnames: [this.host],
        });
      }

      if (this.browsingData.history) {
        let visits = await browser.history.search({
          text: this.host,
          startTime: 0,
          maxResults: 1000000000,
        });

        // no bulk option??
        for (var i = 0; i < visits.length; i++) {
          if (new URL(visits[i].url).hostname == this.host) {
            await browser.history.deleteUrl({
              url: visits[i].url,
            });
          }
        }
      }

      await this.search();
      this.showMessage = true;
      this.loading = false;

      setTimeout(() => {
        this.browsingData.dialog = false;
        this.browsingData.cookies = false;
        this.browsingData.history = false;
        this.showMessage = false;
      }, 1250);
    },
    openLink() {
      browser.tabs.create({ active: false, url: this.url });

      setTimeout(() => {
        this.dialog = false;
      }, 500);
    },
    openBrowsingDataModal(host) {
      this.host = host;
      this.browsingData.dialog = true;
    },
    openModal(url) {
      this.url = url;
      this.dialog = true;
    },
    parseQuery(query) {
      let q = {
        query: {
          text: '',
          startTime: 0,
          maxResults: 250,
        },
        error: '',
        filters: [],
      };

      // get filters
      let filters = query.match(/(?:^|\W)\-(\w+)(?!\w)/g);
      if (filters) {
        for (var i = 0; i < filters.length; i++) {
          q.filters.push(filters[i].replace(/\s?-/g, '').toLowerCase());

          // remove filter from query
          query = query.replace(filters[i], '');
        }
      }

      // get date range
      let range = query.match(/(?:^|\W)([0-9]{2,8})?\.\.([0-9]{2,8})?(?=\s|$)/);
      if (range) {
        let start = this.validateDate(range[1], 'start');
        let end = this.validateDate(range[2], 'end');

        if (range[1]) {
          if (start) {
            q.query.startTime = start;
          } else {
            q.error = 'Invalid date range: start time';
          }
        }

        if (!range[1] && range[2]) {
          if (end) {
            q.query.startTime = 0;
            q.query.endTime = end;
          } else {
            q.error = 'Invalid date range: end time';
          }
        }

        if (range[1] && range[2]) {
          if (start && !end) {
            q.error = 'Invalid date range: end time';
          } else if (!start && end) {
            q.error = 'Invalid date range: start time';
          } else {
            q.error = 'Invalid date range: start is >= end time';
          }
        }

        // remove date from query
        query = query.replace(range[0], '');
      }

      // remove trailing operator
      q.query.text = query.replace(/\s\-(?=\s|$)/g, '');
      return q;
    },
    async remove() {
      await browser.history.deleteUrl({ url: this.url });
      await this.search();

      this.showMessage = true;

      setTimeout(() => {
        this.dialog = false;
        this.showMessage = false;
      }, 1500);
    },
    async search() {
      let details = this.parseQuery(this.query);
      this.errorMessage = details.error;

      if (details.error != '') {
        return;
      }

      let results = await browser.history.search(details.query);

      for (var i = 0; i < details.filters.length; i++) {
        results = results.filter(visit => !visit.url.toLowerCase().includes(details.filters[i]) && !visit.title.toLowerCase().includes(details.filters[i]));
      }

      let groups = {};
      let h = null;
      for (var i = 0; i < results.length; i++) {
        h = new URL(results[i].url).hostname;

        if (groups[h]) {
          groups[h].push(results[i]);
        } else {
          groups[h] = [results[i]];
        }
      }

      let hosts = Object.keys(groups);
      hosts.sort();

      this.groupedResults = hosts.map(host => {
        return { host, results: groups[host] };
      });

      this.results = results;
      this.noResults = !results.length;
    },
    validateDate(d, parseType) {
      if (d == undefined) return null;

      let now = this.$moment();
      let units = {
        '2': ['MM', 'month'],
        '4': ['YYYY', 'year'],
        '6': ['YYYYMM', 'month'],
        '8': ['YYYYMMDD', 'day'],
      };

      let key = d.length.toString();

      if (units[key]) {
        let date = this.$moment(d, [units[key][0]]);

        if (parseType == 'end') {
          date.endOf(units[key][1]);
        }

        if (date.isValid()) {
          if (!(date.year() >= 1970 && date.year() <= now.year())) {
            return null;
          }

          return date.valueOf();
        }
      }

      return null;
    },
  },
};
</script>

<style>
/* Need to remove margin/padding on checkbox */

.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.v-input__slot {
  margin-bottom: 0 !important;
}
</style>
