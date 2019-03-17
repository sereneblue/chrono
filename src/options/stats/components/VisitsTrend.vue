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
            data: dataset,
            type: 'line',
            pointRadius: 2,
            backgroundColor: colors.indigo.base,
            borderColor: colors.indigo.darken3,
            borderWidth: 2,
            hoverBackgroundColor: colors.indigo.lighten1,
            hoverBorderColor: colors.indigo.darken3,
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
                color: "rgba(255, 255, 255, 0.2)"
              },
              ticks: {
                fontColor:'white'
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
