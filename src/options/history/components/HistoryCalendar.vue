<template>
  <v-calendar v-model="start" ref="calendar" @click:day="getDayHistory" :color="themeColor" type="month">
    <template v-slot:day="{ date }">
      <template v-if="visits[date] && visits[date].visits.length">
        <v-card flat tile :color="getColor(visits[date].bucket)">
          <div class="daily-stats">
            <span>{{ visits[date].views }} views</span><br />
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
  computed: {
    eventColors() {
      return {
        dark: {
          low: this.$colors.lightGreen.lighten1,
          med: this.$colors.amber.lighten1,
          high: this.$colors.red.lighten2,
        },
        light: {
          low: this.$colors.lightGreen.lighten4,
          med: this.$colors.amber.lighten3,
          high: this.$colors.red.lighten4,
        },
      };
    },
    start: {
      get() {
        return this.$store.state.month;
      },
      set(date) {
        this.$store.dispatch('changeMonth', date);
      },
    },
    themeColor() {
      return this.$store.state.themeColor;
    },
    visits() {
      return this.$store.state.visits;
    },
  },
  methods: {
    getColor(bucket) {
      return this.$store.state.darkModeEnabled ? this.eventColors.dark[bucket] : this.eventColors.light[bucket];
    },
    getDayHistory(day) {
      if (this.visits[day.date]) {
        this.$store.dispatch('updateViewDay', day.date);
        this.$store.dispatch('updateHistoryOpen', true);
      }
    },
  },
};
</script>

<style lang="scss">
.daily-stats {
  color: black;
  cursor: pointer;
  text-align: left;
  padding: 5px 10px;
}

/* 
    Ideally, shouldn't be doing this 
  */

.v-calendar-weekly__head-weekday {
  font-size: 14px !important;
  padding: 10px 0px !important;
}

.v-calendar-weekly__day-label span {
  font-size: 14px !important;
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
