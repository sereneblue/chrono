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
  methods: {
    renderChart: function () {
      let ctx = document.getElementById("dayOfWeek");
      let dayOfWeekChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          datasets: [{
            data: this.data,
            backgroundColor: colors.indigo.base,
            borderColor: colors.indigo.darken3,
            borderWidth: 3,
            hoverBackgroundColor: colors.indigo.lighten1,
            hoverBorderColor: colors.indigo.darken3
          }]
        },
        options: {
          legend: {
            display: false,
            labels: {
              fontColor: 'white'
            }
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                color: "rgba(255, 255, 255, 0.2)"
              },
              ticks: {
                fontColor:'white'
              }
            }],
            yAxes: [{
              gridLines: {
                color: "rgba(255, 255, 255, 0.2)"
              },
              scaleLabel: {
                display: true,
                fontColor:'white',
                labelString: 'visits'
              },
              ticks: {
                fontColor:'white'
              }
            }]
          }
        }
      });
    }
  },
  mounted() {
    this.renderChart();
  }
}
</script>

<style>
</style>