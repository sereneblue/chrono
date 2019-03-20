<template>
  <v-container fill-height fluid grid-list-md text-lg-center>
    <v-layout align-center wrap>
      <v-flex
        sm4
        xs12
        class="text-sm-left text-xs-center"
      >
        <v-btn @click="prev()">
          <v-icon
            left
          >
            keyboard_arrow_left
          </v-icon>
          Prev
        </v-btn>
      </v-flex>
      <v-flex
        sm4
        xs12
        class="headline text-xs-center"
      >
        {{ month }}
      </v-flex>
      <v-flex
        sm4
        xs12
        class="text-sm-right text-xs-center"
      >
        <v-btn>
          <v-icon>
            search
          </v-icon>
        </v-btn>
        <v-btn>
          <v-icon>
            delete
          </v-icon>
        </v-btn>
        <v-btn @click="next()" :disabled="isDisabled">
          Next
          <v-icon
            right
          >
            keyboard_arrow_right
          </v-icon>
        </v-btn>
      </v-flex>
      <v-flex
        xs12
        class="mb-3"
      >
        <v-sheet height="80vh">
          <HistoryCalendar ref="historycal" />
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HistoryCalendar from './components/HistoryCalendar.vue';

export default {  
  name: 'HistoryView',
  components: {
    HistoryCalendar
  },
  data() {
    return {
      currentMonth: this.$moment().format("MMMM YYYY"),
      searchVisits: [],
      visits: {}
    }
  },
  async created() {
    this.$store.dispatch('changeMonth', this.$moment().format('YYYY-MM-DD'));
    await this.getVisits();
  },
  computed: {
    isDisabled() {
      return this.currentMonth == this.month;
    },
    month() {
      return this.$moment(this.start).format("MMMM YYYY");
    },
    start() {
      return this.$store.state.month;
    }
  },
  methods: {
    async getVisits() {
      let m = this.$moment(this.start);
      let date = null;

      let visits = await browser.history.search({
        text: "",
        startTime: m.startOf('month').valueOf(),
        endTime: m.endOf('month').valueOf(),
        maxResults: 1000000000
      });

      this.visits = visits;
    },
    next() {
      this.$refs.historycal.$refs.calendar.next();
    },
    prev() {
      this.$refs.historycal.$refs.calendar.prev();
    }
  }
};
</script>