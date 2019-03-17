<template>
  <div class="chart-container" style="height: 475px; padding: 10px; position: relative;">
    <canvas id="visits"></canvas>
  </div>
</template>

<script>
import colors from 'vuetify/es5/util/colors';

export default {
  name: 'VisitsTrend',
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
      let labels = this.data.map(d => d[0]);
      let dataset = this.data.map(d => d[1]);

      let ctx = document.getElementById("visits");
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: dataset,
            type: 'line',
            pointRadius: 2,
            backgroundColor: colors[this.themeColor].base,
            borderColor: colors[this.themeColor].darken3,
            borderWidth: 2,
            hoverBackgroundColor: colors[this.themeColor].lighten1,
            hoverBorderColor: colors[this.themeColor].darken3,
            fill: true
          }]
        },
        options: {
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              type: 'time',
              position: 'bottom',
              gridLines: {
                color: this.color.grid
              },
              ticks: {
                fontColor: this.color.font
              },
              time: {
                displayFormats: {
                  month: 'MMM YYYY'
                },
                tooltipFormat: 'MM/DD/YYYY',
                unit: 'month',
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
      handler (val, oldVal) {
        this.renderChart();
      }
    },
    darkModeEnabled: {
      handler(val, oldVal) {
        // can't set ticks.fontColor directly
        // need to use minor.fontColor
        // https://github.com/chartjs/Chart.js/issues/5105

        this.chart.options.scales.xAxes[0].gridLines.color = this.color.grid;
        this.chart.options.scales.xAxes[0].ticks.minor.fontColor = this.color.font;
        this.chart.options.scales.xAxes[0].ticks.major.fontColor = this.color.font;
        this.chart.options.scales.yAxes[0].gridLines.color = this.color.grid;
        this.chart.options.scales.yAxes[0].ticks.minor.fontColor = this.color.font;
        this.chart.options.scales.yAxes[0].scaleLabel.fontColor = this.color.font;
        this.chart.update();
      }
    },
    themeColor: {
      handler (val, oldVal) {
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
