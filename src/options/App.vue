<template>
  <v-app dark>
    <v-tabs
      centered
      color="indigo"
      dark
      slider-color="white"
    >
      <v-tab :key="history">
        <v-icon left small>history</v-icon>
        History
      </v-tab>

      <v-tab :key="stats">
        <v-icon left small>trending_up</v-icon>
        Stats
      </v-tab>

      <v-tab :key="settings">
        <v-icon left small>settings</v-icon>
        Settings
      </v-tab>

      <v-tab-item :key="history">
        <v-container fluid>
          1
        </v-container>
      </v-tab-item>

      <v-tab-item :key="stats">
        <v-container fluid>
          2
        </v-container>
      </v-tab-item>

      <v-tab-item :key="settings">
        <v-container fluid>
          3
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
</style>
