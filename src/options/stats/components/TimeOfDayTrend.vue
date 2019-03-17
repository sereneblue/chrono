<template>
  <div class="chart-container" style="height: 475px; padding: 10px; position: relative;">
    <canvas id="timeOfDay"></canvas>
  </div>
</template>

<script>
import colors from 'vuetify/es5/util/colors';

export default {
  name: 'TimeOfDayTrend',
  props: ['data'],
  methods: {
    renderChart: function () {
      let ctx = document.getElementById("timeOfDay");
      let dayOfWeekChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
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
            display: false
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