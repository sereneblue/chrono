<template>
  <div class="chart-container" style="height: 475px; padding: 10px; position: relative;">
    <canvas id="dayOfWeek"></canvas>
  </div>
</template>

<script>
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