'use strict';

export default class ResultComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, Auth, graph, scores, pdf) {
    this.$http = $http;
    this.graph = graph;
    this.scores = scores;
    this.pdf = pdf;
    this.result = localStorage.getItem('guestResult');
    this.assessment = JSON.parse(this.result);
    this.form = this.assessment.assessment[0];
    this.max = this.assessment.assessment.length;
    this.averages = this.scores.averages(this.assessment.assessment);
    this.graph.paintRadarGraph(this.averages, 'radarGraph');
    this.paintAllGraphs();
    this.formIndex = 0, this.saLength = 0;
    this.dataLoaded = true;
  }//End constructor  

  clearCanvas() {
    var lsaCanvas = document.getElementById('saLine'), lqaCanvas = document.getElementById('qaLine');
    var lsaCon = document.getElementById('lsa'), lqaCon = document.getElementById('lqa');
    var l1 = document.createElement('canvas'), l2 = document.createElement('canvas');
    l1.id = 'saLine', l1.className = 'graph-padding-two';
    l2.id = 'qaLine', l2.className = 'graph-padding-two';
    lsaCanvas.remove(), lqaCanvas.remove();
    lsaCon.appendChild(l1), lqaCon.appendChild(l2);
  }//End clearCanvas

  paintAllGraphs() {
    var saObj = this.scores.countSAResponse(this.form);
    var saScoreObj = this.scores.countSAScores(this.form);
    var qaScoreObj = this.scores.countQAScores(this.form);
    this.saLength = saObj.saLength;
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
  }//End prev

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