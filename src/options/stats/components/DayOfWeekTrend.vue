<template>
  <div class="chart-container" style="height: 475px; padding: 10px; position: relative;">
    <canvas id="dayOfWeek"></canvas>
  </div>
</template>

<script>
import colors from 'vuetify/es5/util/colors';

export default {
  name: 'DayOfWeekTrend',
  props: ['data'],
  data() {
    return {
      chart: null
    }
  },
  computed: {
    color() {
      return this.$store.state.darkModeEnabled ? {
        font: 'white',
        grid: 'rgba(255, 255, 255, 0.2)'
      } : {
        font: 'black',
        grid: 'rgba(0, 0, 0, 0.2)'
      };
    },
    darkModeEnabled() {
      return this.$store.state.darkModeEnabled;
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
    renderChart: function () {
      let ctx = document.getElementById("dayOfWeek");
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          datasets: [{
            data: this.data,
            backgroundColor: colors[this.themeColor].base,
            borderColor: colors[this.themeColor].darken3,
            borderWidth: 2,
            hoverBackgroundColor: colors[this.themeColor].lighten1,
            hoverBorderColor: colors[this.themeColor].darken3,
          }]
        },
        options: {
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                color: this.color.grid
              },
              ticks: {
                fontColor: this.color.font
              }
            }],
            yAxes: [{
              gridLines: {
                color: this.color.grid
              },
              scaleLabel: {
                display: true,
                fontColor: this.color.font,
                labelString: 'visits'
              },
              ticks: {
                fontColor: this.color.font
              }
            }]
          }
        }
      });
    }
  },
  watch: {
    data: {
      handler() {
        this.renderChart();
      }
    },
    darkModeEnabled: {
      handler() {
        // can't set ticks.fontColor directly
        // need to use minor.fontColor
        // https://github.com/chartjs/Chart.js/issues/5105

        this.chart.options.scales.xAxes[0].gridLines.color = this.color.grid;
        this.chart.options.scales.xAxes[0].ticks.minor.fontColor = this.color.font;
        this.chart.options.scales.yAxes[0].gridLines.color = this.color.grid;
        this.chart.options.scales.yAxes[0].ticks.minor.fontColor = this.color.font;
        this.chart.options.scales.yAxes[0].scaleLabel.fontColor = this.color.font;
        this.chart.update();
      }
    },
    themeColor: {
      handler() {
        this.chart.data.datasets[0].backgroundColor = colors[this.themeColor].base;
        this.chart.data.datasets[0].borderColor = colors[this.themeColor].darken3;
        this.chart.data.datasets[0].hoverBackgroundColor = colors[this.themeColor].lighten1;
        this.chart.data.datasets[0].hoverBorderColor = colors[this.themeColor].darken3;
        this.chart.update();
      }
    }
  }
}
</script>

<style>
</style>