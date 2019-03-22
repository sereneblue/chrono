<template>
  <v-calendar
    ref="calendar"
    v-model="start"
    type="month"
    :color="themeColor"
  >
    <template v-slot:day="{ date }">
      <template v-if="visits[date]">
        <v-card flat tile :color="getColor(visits[date].bucket)">
          <div class="daily-stats">
            <span>{{ visits[date].views }} views</span><br>
            <span>{{ visits[date].pages }} {{ visits[date].pages == 1 ? 'page' : 'pages' }}</span>
          </div>
        </v-card>
      </template>
    </template>
  </v-calendar>
</template>

<script>
export default {
  name: 'HistoryCalendar',
  props: ['visits'],
  computed: {
    eventColors() {
      return {
        dark: {
          low: this.$colors.lightGreen.darken4, 
          med: this.$colors.orange.darken2,
          high:  this.$colors.red.darken4,
        },
        light: {
          low: this.$colors.lightGreen.lighten4, 
          med: this.$colors.amber.lighten3,
          high: this.$colors.red.lighten4  
        }
      }
    },
    start: {
      get() {
        return this.$store.state.month;
      },
      set(date) {
        this.$store.dispatch('changeMonth', date);
      }
    },
    themeColor() {
      let theme = this.$store.state.themeColor;

      if (theme.includes("-")) {
        let parts = theme.split('-'); 
        theme = `${parts[0]}${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
      }

      return theme;
    }
  },
  methods: {
    getColor(bucket) {
      return this.$store.state.darkModeEnabled ? this.eventColors.dark[bucket] : this.eventColors.light[bucket];
    }
  }
}
</script>

<style lang="scss">
  .daily-stats {
    text-align: left;
    padding: 5px 10px;
  }

  /* 
    Ideally, shouldn't be doing this 
  */
  
  .v-calendar-weekly__head-weekday {
    padding: 10px 0px !important;
  }

  .v-calendar {
    &.theme--light {
      & .v-calendar-weekly__head-weekday {
        box-shadow: inset 0 -1px 0 0 #e0e0e0;
      }
    }

    &.theme--dark {
      & .v-calendar-weekly__head-weekday {
        box-shadow: inset 0 -1px 0 0 #9e9e9e;
      }
    }
  }
</style>