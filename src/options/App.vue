<template>
  <v-app v-if="loaded" :dark="darkModeEnabled">
    <v-tabs
      centered
      :color="theme"
      :slider-color="darkModeEnabled ? 'white' : 'black'"
    >
      <v-tab key="history">
        <v-icon left small>history</v-icon>
        History
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
          1
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
import StatsView from './stats/StatsView.vue';
import SettingsView from './settings/SettingsView.vue';

export default {
  name: 'App',
  components: {
    StatsView,
    SettingsView
  },
  computed: {
    darkModeEnabled() {
      return this.$store.state.darkModeEnabled;
    },
    loaded() {
      return this.$store.state.loaded;
    },
    theme() {
      return this.$store.state.themeColor;
    }
  },
  created() {
    this.$store.dispatch('updateSettings');
  }
};
</script>

<style scoped>
</style>