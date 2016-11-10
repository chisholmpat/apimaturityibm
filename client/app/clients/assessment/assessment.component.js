'use strict';

export default class ViewAssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.userId = this.$cookies.get('userId');
    this.clientId = this.$cookies.get('clientId');
    this.clientName = this.$cookies.get('clientName');
    this.assessmentId = this.$cookies.get('assessmentId');
    this.assessmentName = this.$cookies.get('assessmentName');
    this.assessment = null, this.form = null;
    this.formIndex = 0, this.max = 0, this.saLength = 0;
    this.gTitles = ['Self Assessment Responses', 'Quality Assessment Responses'];
    this.saLabels = ['Novice', 'Progressing', 'Mature'];
    this.qaLabels = ["Don't do it", "Planned", "In Progress", "Partially Implemented", "Mature"];
  }//End constructor  

  $onInit() {      
    this.$http.get('/api/users/assessment/' + this.userId + '/' + this.clientId + '/' + this.assessmentId)
    .then(response => {
      this.assessment = response.data;
      this.form = this.assessment.assessment[0];
      this.max = this.assessment.assessment.length;
      this.paintAllGraphs();
      this.dataLoaded = true;
    });
  }//End onInit

  calcScore(answer, weight) {
    if ((answer == 2 || answer == 3) && (weight == 2 || weight == 3)) {
      console.log('hit');
      return answer - 1;
    } else {
      return answer;
    }//End if
  }//End calcScore

  setSAResponse(q) {
    switch (q.answer) {
      case 1:
      return 'Novice'; 
      break;
      case 2:
      return 'Progressing'
      break;
      case 3: 
      return 'Mature'
      break;
    }//End switch

  }//End seSAResponse

  setQAResponse(q) {
    switch (q.answer) {
      case 1:
      return "Don't do it"; 
      break;
      case 2:
      return 'Planned'
      break;
      case 3:
      return 'In progress'
      break;
      case 4:
      return 'Partially Implemented'
      break;
      case 5:
      return 'Mature'
      break;
    }//End switch
  }//End setQAResponse

  paintLineGraph(data, ctx) {
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

  paintPieChart(data, labels, title, ctxId) {
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

  clearCanvas() {
    var saCanvas = document.getElementById('saBar'), qaCanvas = document.getElementById('qaBar');
    var lsaCanvas = document.getElementById('saLine'), lqaCanvas = document.getElementById('qaLine');
    var saCon = document.getElementById('gsa'), qaCon = document.getElementById('gqa');
    var lsaCon = document.getElementById('lsa'), lqaCon = document.getElementById('lqa');
    var c1 = document.createElement('canvas'), c2 = document.createElement('canvas');
    var l1 = document.createElement('canvas'), l2 = document.createElement('canvas');
    saCanvas.remove();
    qaCanvas.remove();
    lsaCanvas.remove();
    lqaCanvas.remove();
    c1.id = 'saBar', c1.className = 'graph-padding-one';
    c2.id = 'qaBar', c2.className = 'graph-padding-one';
    l1.id = 'saLine', l1.className = 'graph-padding-two';
    l2.id = 'qaLine', l2.className = 'graph-padding-two';
    saCon.appendChild(c1);
    qaCon.appendChild(c2);
    lsaCon.appendChild(l1);
    lqaCon.appendChild(l2);
  }//End clearCanvas

  paintAllGraphs() {
    var saCounts = this.countSAResponse(this.form);
    var qaCounts = this.countQAResponse(this.form);
    var saScoreObj = this.countSAScores(this.form);
    var qaScoreObj = this.countQAScores(this.form);
    this.paintPieChart(saCounts, this.saLabels, this.form.name + ': ' + this.gTitles[0], 'saBar');
    this.paintPieChart(qaCounts, this.qaLabels, this.form.name + ': ' + this.gTitles[1], 'qaBar');
    this.paintLineGraph(saScoreObj, 'saLine');
    this.paintLineGraph(qaScoreObj, 'qaLine');
  }//End paintAllGraphs

  countSAScores(form) {
    var self = this;
    var scoreObj = {};
    var qs = form.questions, scores = [], uScores = [], labels = [], maxScores = [], i = 0;
    qs.forEach(function(q) {
      if (q.category === "Self-Assessment") {
        ++i;
        var score = self.calcScore(q.answer, q.weight);
        var qLabel = 'Q:'+i;
        maxScores.push(3);
        uScores.push(q.answer);
        scores.push(score);
        labels.push(qLabel);
      }
    });

    scoreObj.uScores = uScores;
    scoreObj.scores = scores;
    scoreObj.labels = labels;
    scoreObj.maxScores = maxScores;

    return scoreObj;
  }//End countScores

  countQAScores(form) {
    var self = this;
    var scoreObj = {};
    var qs = form.questions, scores = [], uScores = [], labels = [], maxScores = [], i = 0;

    qs.forEach(function(q) {
      
      if (q.category === "Quantitative-Assessment") {
        ++i;
        var score = self.calcScore(q.answer, q.weight);
        var qLabel = 'Q:'+i;
        maxScores.push(5);
        uScores.push(q.answer);
        scores.push(score);
        labels.push(qLabel);
      }
    });

    scoreObj.uScores = uScores;
    scoreObj.scores = scores;
    scoreObj.labels = labels;
    scoreObj.maxScores = maxScores;

    return scoreObj;
  }//End countScores

  countSAResponse(form) {
    var saCounts = [0,0,0];

    for (var j = 0; j < form.questions.length; j++) {
      if (form.questions[j].category === 'Self-Assessment') {
        ++this.saLength;
        switch (form.questions[j].answer) {
          case 1: 
          ++saCounts[0];
          break;
          case 2: 
          ++saCounts[1];
          break;
          case 3: 
          ++saCounts[2];
          break;
        }//End switch
      }//End if
    }//End for

    return saCounts;
  }//End countSAResponse

  countQAResponse(form) {
    var qaCounts = [0,0,0,0,0];

    for (var j = 0; j < form.questions.length; j++) {
      if (form.questions[j].category === 'Quantitative-Assessment') {
        switch (form.questions[j].answer) {
          case 1: 
          ++qaCounts[0];
          break;
          case 2: 
          ++qaCounts[1];
          break;
          case 3: 
          ++qaCounts[2];
          break;
          case 4: 
          ++qaCounts[3];
          break;
          case 5: 
          ++qaCounts[4];
          break;
        }//End switch
      }//End if
    }//End for

    return qaCounts;
  }//End countSAResponse

  convertToPdf() {
    var doc = new jsPDF("portrait");
    var name = this.form.name, date = new Date();
    var datePrint = date.toLocaleDateString();
    var yMargin = 10;

    doc.setLineWidth(500);
    doc.setFontSize(12);
    doc.text('API Maturity Survey Results', 10, yMargin)
    doc.setFontSize(10);
    yMargin = yMargin+5;
    doc.text('Client: ' + this.clientName + ', Date: ' + datePrint, 10, yMargin)
    yMargin = yMargin+10;
    doc.setFontSize(12);
    doc.text('Form: ' + name, 10, yMargin);
    yMargin = yMargin+10;
    doc.setFontSize(10);
    doc.text('Self-Assessment:', 10, yMargin);
    doc.setFontSize(8);
    yMargin = yMargin + 5;

    var i = 0;
    for (var j = 0; j < this.form.questions.length; j++) {
      if (this.form.questions[j].category == 'Self-Assessment') {
        
        ++i;
        var score = this.calcScore(this.form.questions[j].answer, this.form.questions[j].weight);
        var response = this.setSAResponse(this.form.questions[j]);
        var questionString = 'Q:' + i + ' ' + this.form.questions[j].question + ' (Score: ' + 
          score  + ', Response: ' + response + ' / Value [' + this.form.questions[j].answer +
          '], Weight: ' + this.form.questions[j].weight + ')';
        var splitQuestion = doc.splitTextToSize(questionString, 180);

        //loop thru each line and output while increasing the vertical space
        for(var c = 0, stlength = splitQuestion.length ; c < stlength ; c++) {
            doc.text(splitQuestion[c], 10, yMargin);
            yMargin = yMargin + 5;
        }//End for
      }//End if
    }//End for

    var saPieBase64 = this.chartToBase64('#ffffff', 'saBar');
    doc.addImage(saPieBase64, 'PNG', 10, yMargin, 75, 75);
    yMargin = yMargin + 85;
    var saLineBase64 = this.chartToBase64('#ffffff', 'saLine');
    doc.addImage(saLineBase64, 'PNG', 10, yMargin, 150, 75);
    yMargin = yMargin + 85;
    doc.setFontSize(10);
    doc.addPage();
    yMargin = 10;
    doc.text('Quality-Assessment:', 10, yMargin);
    doc.setFontSize(8);
    yMargin = yMargin + 5;

    i = 0;
    for (var j = 0; j < this.form.questions.length; j++) {
      if (this.form.questions[j].category == 'Quantitative-Assessment') {
        
        ++i;
        var score = this.calcScore(this.form.questions[j].answer, this.form.questions[j].weight);
        var response = this.setQAResponse(this.form.questions[j]);
        var questionString = 'Q:' + i + ' ' + this.form.questions[j].question + ' (Score: ' + 
          score  + ', Response: ' + response + ' / Value [' + this.form.questions[j].answer +
          '], Weight: ' + this.form.questions[j].weight + ')';
        var splitQuestion = doc.splitTextToSize(questionString, 180);

        //loop thru each line and output while increasing the vertical space
        for(var c = 0, stlength = splitQuestion.length ; c < stlength ; c++) {
            doc.text(splitQuestion[c], 10, yMargin);
            yMargin = yMargin + 5;
        }//End for
      }//End if
    }//End for

    var qaPieBase64 = this.chartToBase64('#ffffff', 'qaBar');
    doc.addImage(qaPieBase64, 'PNG', 10, yMargin, 75, 75);
    yMargin = yMargin + 85;
    var qaLineBase64 = this.chartToBase64('#ffffff', 'qaLine');
    doc.addImage(qaLineBase64, 'PNG', 10, yMargin, 150, 75);

    doc.save(this.clientName +  '_' + name + '_Results_' + datePrint + '.pdf')
  }//End convertToPdf

  // Convert transparencies in canvas to base64 example:
  //https://github.com/mikechambers/ExamplesByMesh/blob/master/HTML5/canvas/exportWithBackgroundColor/scripts/main.js
  chartToBase64(backgroundColor, canvasRef) {
    var canvas = document.getElementById(canvasRef);  
    var context = canvas.getContext("2d");  
    var w = canvas.width;
    var h = canvas.height;
    var data;       

    if(backgroundColor)
    {
        data = context.getImageData(0, 0, w, h);
        var compositeOperation = context.globalCompositeOperation;
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = backgroundColor;
        context.fillRect(0,0,w,h);
    }//End if

    var imageData = document.getElementById(canvasRef).toDataURL('image/png');

    if(backgroundColor)
    {
        context.clearRect (0,0,w,h);
        context.putImageData(data, 0,0);        
        context.globalCompositeOperation = compositeOperation;
    }

    return imageData;
  }//End chartToBase64

  next() { 
    if (this.formIndex >= this.max - 1) {
      this.formIndex = 0;
    } else {
      this.formIndex++;
      this.form = this.assessment.assessment[this.formIndex];
      this.saLength = 0;
      this.clearCanvas();
      this.paintAllGraphs();
    }
  }//End next

  prev() { 
    if (this.formIndex <= 0) {
      this.formIndex = this.max - 1;
    } else {
      this.formIndex--;
      this.form = this.assessment.assessment[this.formIndex];
      this.saLength = 0;
      this.clearCanvas();
      this.paintAllGraphs();
    }
  }//End next

  checkMax() {
    if (this.formIndex >= this.max - 1) {
      return true;
    }   
    return false;
  }//End checkMax

  checkMin() {
    if (this.formIndex <= 0) {
      return true;
    }
    return false;
  }//End checkMin
} //End AssessmentsComponent