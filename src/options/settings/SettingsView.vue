<template>
  <v-container fluid text-center>
    <v-select :color="themeColor" :items="tabs" :value="currentTab" @change="updateMainTab" label="Main tab">
      <template slot="item" slot-scope="data">
        {{ data.item | toTitleCase }}
      </template>

      <template slot="selection" slot-scope="data">
        {{ data.item | toTitleCase }}
      </template>
    </v-select>
    <v-select :color="themeColor" :items="colorsList" :value="currentTheme" @change="changeThemeColor" label="Theme color">
      <template slot="item" slot-scope="data">
        <v-icon large :color="getBaseColor(data.item)">mdi-label</v-icon>&nbsp;&nbsp;{{ data.item | toTitleCase }}
      </template>

      <template slot="selection" slot-scope="data">
        {{ data.item | toTitleCase }}
      </template>
    </v-select>
    <v-switch v-model="darkModeEnabled" :color="themeColor" :label="`Dark Mode ${darkModeEnabled ? 'Enabled' : 'Disabled'}`"></v-switch>
    <div class="headline mb-2">chrono can be opened by pressing CTRL + ALT + H</div>
    <div class="title font-weight-medium">v1.0.5 by sereneblue</div>
    <v-btn href="https://github.com/sereneblue/chrono" target="_blank">View source code</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'SettingsView',
  data() {
    return {
      tabs: ['history', 'search', 'stats'],
    };
  },
  computed: {
    colorsList() {
      return Object.keys(this.$colors)
        .slice(0, -1)
        .map(c => c.replace(/([A-Z])/g, match => `-${match.toLowerCase()}`));
    },
    currentTab() {
      return this.$store.state.mainTab;
    },
    currentTheme() {
      return this.$store.state.themeColor;
    },
    darkModeEnabled: {
      get() {
        return this.$store.state.darkModeEnabled;
      },
      set(value) {
        this.$store.dispatch('toggleDarkMode', value);
      },
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
  },
  filters: {
    toTitleCase(text) {
      if (!text.includes('-')) {
        return `${text.charAt(0).toUpperCase() + text.slice(1)}`;
      }

      let parts = text.split('-');
      return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
    },
  },
  methods: {
    changeThemeColor(theme) {
      this.$store.dispatch('changeTheme', theme);
    },
    getBaseColor(c) {
      if (c.includes('-')) {
        let parts = c.split('-');
        c = `${parts[0]}${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
      }

      return this.$colors[c].base;
    },
    updateMainTab(tab) {
      this.$store.dispatch('updateMainTab', tab);
    },
  },
};
</script>
