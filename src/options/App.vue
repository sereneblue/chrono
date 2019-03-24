<template>
  <v-app v-if="loaded" :dark="darkModeEnabled">
    <v-tabs
      v-model="activeTab"
      centered
      fixed-tabs
      :color="theme"
      :slider-color="darkModeEnabled ? 'white' : 'black'"
    >
      <v-tab key="history">
        <v-icon left small>history</v-icon>
        History
      </v-tab>

      <v-tab key="search">
        <v-icon left small>search</v-icon>
        Search
      </v-tab>

      <v-tab key="stats">
        <v-icon left small>trending_up</v-icon>
        Stats
      </v-tab>

      <v-tab key="settings">
        <v-icon left small>settings</v-icon>
        Settings
      </v-tab>

      <v-tab-item key="history">
        <v-container fluid>
          <HistoryView />
        </v-container>
      </v-tab-item>

      <v-tab-item key="search">
        <v-container fluid>
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
import StatsView from './stats/StatsView.vue';
import SettingsView from './settings/SettingsView.vue';

export default {
  name: 'App',
  components: {
    HistoryView,
    StatsView,
    SettingsView
  },
  created() {
    this.$store.dispatch('updateSettings');
  },
  data() {
    return {
      tabs: {
        'history': 0,
        'search': 1,
        'stats': 2
      }
    }
  },
  computed: {
    activeTab: {
      get() {
        return this.tabs[this.$store.state.activeTab];
      },
      set() {
        // do nothing
      }
    },
    darkModeEnabled() {
      return this.$store.state.darkModeEnabled;
    },
    loaded() {
      return this.$store.state.loaded;
    },
    theme() {
      return this.$store.state.themeColor;
    }
  }
};
</script>

<style scoped>
</style>