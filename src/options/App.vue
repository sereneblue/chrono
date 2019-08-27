<template>
  <v-app v-if="loaded">
    <v-tabs v-model="activeTab" centered :background-color="theme" :color="darkModeEnabled ? 'white' : 'black'">
      <v-tab key="history">
        <v-icon left small>mdi-history</v-icon>
        History
      </v-tab>

      <v-tab key="search">
        <v-icon left small>mdi-magnify</v-icon>
        Search
      </v-tab>

      <v-tab key="stats">
        <v-icon left small>mdi-trending-up</v-icon>
        Stats
      </v-tab>

      <v-tab key="settings">
        <v-icon left small>mdi-settings</v-icon>
        Settings
      </v-tab>

      <v-tab-item key="history">
        <v-container fluid>
          <HistoryView />
        </v-container>
      </v-tab-item>

      <v-tab-item key="search">
        <v-container fluid>
          <SearchView />
        </v-container>
      </v-tab-item>

      <v-tab-item key="stats">
        <v-container fluid>
          <StatsView />
        </v-container>
      </v-tab-item>

      <v-tab-item key="settings">
        <v-container fluid>
          <SettingsView />
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-app>
</template>

<script>
import HistoryView from './history/HistoryView.vue';
import SearchView from './search/SearchView.vue';
import SettingsView from './settings/SettingsView.vue';
import StatsView from './stats/StatsView.vue';

export default {
  name: 'App',
  components: {
    HistoryView,
    SearchView,
    SettingsView,
    StatsView,
  },
  created() {
    this.$store.dispatch('updateSettings');
    this.$vuetify.theme.dark = this.$store.state.darkModeEnabled;
  },
  data() {
    return {
      tabs: {
        history: 0,
        search: 1,
        stats: 2,
      },
    };
  },
  computed: {
    activeTab: {
      get() {
        return this.tabs[this.$store.state.activeTab];
      },
      set() {
        // do nothing
      },
    },
    darkModeEnabled() {
      return this.$store.state.darkModeEnabled;
    },
    loaded() {
      return this.$store.state.loaded;
    },
    theme() {
      return this.$store.state.themeColor;
    },
  },
  watch: {
    darkModeEnabled: {
      handler(val) {
        this.$vuetify.theme.dark = val;
      },
    },
  },
};
</script>

<style>
.container--fluid {
  padding-top: 15px !important;
  padding-left: 35px !important;
  padding-right: 35px !important;
}

.theme--dark.v-tabs-items {
  background-color: transparent !important;
}
</style>
