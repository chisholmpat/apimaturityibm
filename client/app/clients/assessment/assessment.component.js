'use strict';

export default class ViewAssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, Auth, graph, scores, pdf) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.graph = graph;
    this.scores = scores;
    this.pdf = pdf;
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
    var saObj = this.scores.countSAResponse(this.form);
    this.saLength = saObj.saLength;
    var saCounts = saObj.saCounts;
    var qaCounts = this.scores.countQAResponse(this.form);
    var saScoreObj = this.scores.countSAScores(this.form);
    var qaScoreObj = this.scores.countQAScores(this.form);
    this.graph.paintPieChart(saCounts, this.saLabels, this.form.name + ': ' + this.gTitles[0], 'saBar');
    this.graph.paintPieChart(qaCounts, this.qaLabels, this.form.name + ': ' + this.gTitles[1], 'qaBar');
    this.graph.paintLineGraph(saScoreObj, 'saLine');
    this.graph.paintLineGraph(qaScoreObj, 'qaLine');
  }//End paintAllGraphs

  savePDF() {
    this.pdf.convertToPDF(this.form, this.clientName);
  }//End savePDF

  next() { 
    this.formIndex++;
    this.form = this.assessment.assessment[this.formIndex];
    this.saLength = 0;
    this.clearCanvas();
    this.paintAllGraphs();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }//End next

  prev() { 
    this.formIndex--;
    this.form = this.assessment.assessment[this.formIndex];
    this.saLength = 0;
    this.clearCanvas();
    this.paintAllGraphs();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
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