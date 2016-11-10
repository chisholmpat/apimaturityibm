'use strict';
const angular = require('angular');

/*@ngInject*/
export function graphService() {
	var graph = this;

	graph.paintLineGraph = function(data, ctx) {
    var ctx = angular.element(document.getElementById(ctx));
    var uScores = data.uScores, scores = data.scores, labels = data.labels, maxScores = data.maxScores;

    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
        {
          label: "Weighted Maturity Curve",
          fill: true,
          lineTension: 0.2,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: scores,
          spanGaps: false,
        },
        {
          label: "Unweighted Maturity Curve",
          fill: true,
          lineTension: 0.2,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: uScores,
          spanGaps: false,
        },
        {
          label: "Maximum Score",
          fill: false,
          lineTension: 0.2,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: maxScores,
          spanGaps: false,
        }
        ]
      },
      options: {
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            display: true,
            cornerRadius: 0,
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          bodyFontSize: 10
        }
      }
    });
  }//End paintLineGraph

  graph.paintPieChart = function(data, labels, title, ctxId) {
    var ctx = angular.element(document.getElementById(ctxId));
    var chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
      }
    })//End chart config
  }//End paintBarGraph

}//End service

export default angular.module('apiLocalApp.graph', [])
  .service('graph', graphService)
  .name;
