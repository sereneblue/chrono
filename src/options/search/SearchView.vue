<template>
  <div>
    <v-container fluid grid-list-md>
      <v-flex>
        <v-text-field
          @keyup.enter="search"
          v-model="query"
          :color="themeColor"
          :error-messages="errorMessage"
          label="Search"
          box
        ></v-text-field>
        <v-checkbox
          v-model="groupByDomain"
          :color="themeColor"
          label="Group results by domain"
        ></v-checkbox>
      </v-flex>
      <v-flex>
        <div v-if="results.length > 0 && !groupByDomain">
          <v-subheader>{{ results.length }} results found</v-subheader>
          <v-list two-line>
            <v-list-tile
              v-for="result in results"
              @click="openModal(result.url)"
              :key="results.id"
            >
              <v-list-tile-avatar>
                {{ result.lastVisitTime | formatDate }}
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title class="subheading">{{ result.title ? result.title : "-- blank title --" }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ result.url }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
        <div v-else-if="results.length > 0 && groupByDomain">
          <v-subheader>{{ results.length }} results found, {{ groupedResults.length }} domains found</v-subheader>
          <v-list v-for="group in groupedResults" two-line subheader>
            <v-layout justify-space-between>
              <v-subheader>{{ group.host }}</v-subheader>
              <v-btn 
                @click.stop="removeHost(group.host)"
                :color="themeColor"
                right
                small
                style="align-self: center;"
                >
                Forget site
              </v-btn>
            </v-layout>
            <v-list-tile
              v-for="result in group.results"
              @click="openModal(result.url)"
              :key="result.id"
            >
              <v-list-tile-avatar>
                {{ result.lastVisitTime | formatDate }}
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title class="subheading">{{ result.title ? result.title : "-- blank title --" }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ result.url }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
          </v-list>
        </div>
        <div v-else-if="results.length == 0">
          <v-subheader>No results found</v-subheader>
        </div>
      </v-flex>
    </v-container>
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
          {{ url.length > 100 ? url.slice(0, 100) + '...' : url }}
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
      dialog: false,
      errorMessage: "",
      groupedResults: [],
      query: "",
      results: [],
      snackbar: false,
      url: ""
    }
  },
  computed: {
    groupByDomain: {
      get() {
        return this.$store.state.groupByDomain;
      },
      set(value) {
        this.$store.dispatch('updateGroupByDomain', value);
      }
    },
    themeColor() {
      return this.$store.state.themeColor;
    }
  },
  filters: {
    formatDate(ms) {
      let d = new Date(ms);
      return `${('0' + (d.getMonth() + 1)).slice(-2)}/${('0' + d.getDate()).slice(-2)}`;
    }
  },
  methods: {
    copy() {
      this.$copy(this.url);
      this.snackbar = true;
      this.dialog = false;
    },
    openLink() {
      browser.tabs.create({ active: false, url : this.url });
      this.dialog = false;
    },
    openModal(url) {
      this.dialog = true;
      this.url = url;
    },
    parseQuery(query) {
      let q = {
        query: {
          text: "",
          startTime: 0,
          maxResults: 250
        },
        error: "",
        filters: []
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
            q.error = "Invalid date range: start time";
          }
        }

        if (!range[1] && range[2]) {
          if (end) {
            q.query.startTime = 0;
            q.query.endTime = end;
          } else {
            q.error = "Invalid date range: end time";
          }
        }

        if (range[1] && range[2]) {
          if (start && !end) {
            q.error = "Invalid date range: end time";
          } else if (!start && end) {
            q.error = "Invalid date range: start time";
          } else {
            q.error = "Invalid date range: start is >= end time";
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
      this.dialog = false;
    },
    async search() {
      let details = this.parseQuery(this.query);
      this.errorMessage = details.error;

      if (details.error != "") {
        return;
      }

      let results = await browser.history.search(details.query);

      for (var i = 0; i < details.filters.length; i++) {
        results = results.filter(visit => 
                    !visit.url.toLowerCase().includes(details.filters[i]) && 
                    !visit.title.toLowerCase().includes(details.filters[i])
                  );
      };

      let groups = {};
      let h = null;
      for (var i = 0; i < results.length; i++) {
        h = new URL(results[i].url).hostname;

        if (groups[h]) {
          groups[h].push(results[i]);
        } else {
          groups[h] = [results[i]];
        }
      };

      let hosts = Object.keys(groups);
      hosts.sort();

      this.groupedResults = hosts.map(host => {
        return { host, results: groups[host] }
      });

      this.results = results;
    },
    validateDate(d, parseType) {
      if (d == undefined) return null;

      let now =  this.$moment();
      let units = {
        "2" : ["MM", "month"],
        "4" : ["YYYY", "year"],
        "6" : ["YYYYMM", "month"],
        "8" : ["YYYYMMDD", "day"]
      }

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
  }
};
</script>

<style>
  /* Need to remove margin/padding on checkbox */
  
  .v-input--selection-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
</style>