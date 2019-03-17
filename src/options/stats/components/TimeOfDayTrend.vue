<template>
  <div class="chart-container" style="height: 475px; padding: 10px; position: relative;">
    <canvas id="timeOfDay"></canvas>
  </div>
</template>

<script>
export default {
  name: 'TimeOfDayTrend',
  props: ['data'],
  methods: {
    renderChart: function () {
      let ctx = document.getElementById("timeOfDay");
      let dayOfWeekChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
          datasets: [{
            data: this.data,
            backgroundColor: 'red'
          }]
        },
        options: {
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'visits'
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