<template>
  <div class="chart-container" style="height: 475px; padding: 10px; position: relative;">
    <canvas id="visits"></canvas>
  </div>
</template>

<script>
export default {
  name: 'VisitsTrend',
  props: ['data'],
  methods: {
    renderChart: function () {
      let labels = this.data.map(d => d[0]);
      let dataset = this.data.map(d => d[1]);

      let ctx = document.getElementById("visits");
      let visitsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            backgroundColor: 'red',
            borderColor: 'red',
            data: dataset,
            type: 'line',
            pointRadius: 2,
            fill: true,
            lineTension: 0,
            borderWidth: 2
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
              time: {
                displayFormats: {
                  month: 'MMM YYYY'
                },
                tooltipFormat: 'MM/DD/YYYY',
                unit: 'month',
              }
            }],
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
  watch: {
    data: {
      handler (val, oldVal) {
        this.renderChart();
      }
    }
  }
}
</script>

<style>
</style>
