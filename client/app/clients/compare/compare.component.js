'use strict';

export default class CompareToolComponent {
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
    this.sharedSelected = this.$cookies.get('sharedSelected');
    if (this.sharedSelected === 'true') {
      this.userId = this.$cookies.get('sharedUserId');
    } else if (this.sharedSelected === 'false') {
      this.userId = this.$cookies.get('userId');
    }
    this.userIdTwo = this.$cookies.get('userId');
    this.clientId = this.$cookies.get('clientId');
    this.clientName = this.$cookies.get('clientName');
    this.assessmentId = this.$cookies.get('assessmentId');
    this.assessmentName = this.$cookies.get('assessmentName');
    this.clientIdTwo = this.$cookies.get('clientId2');
    this.clientNameTwo = this.$cookies.get('clientName2');
    this.assessmentIdTwo = this.$cookies.get('assessmentId2');
    this.assessmentNameTwo = this.$cookies.get('assessmentName2');
    this.assessmentOne = null, this.assessmentTwo = null, this.formOne = null, this.formTwo = null;
    this.formIndexOne = 0, this.maxOne = 0, this.saLengthOne = 0;
    this.formIndexTwo = 0, this.maxTwo = 0, this.saLengthTwo = 0;
  }//End constructor  

  $onInit() {      
    this.$http.get('/api/users/assessment/' + this.userId + '/' + this.clientId + '/' + this.assessmentId)
    .then(response => {
      this.assessmentOne = response.data;
      this.formOne = this.assessmentOne.assessment[0];
      this.maxOne = this.assessmentOne.assessment.length;
      this.averagesOne = this.scores.averages(this.assessmentOne.assessment);
      this.graph.paintRadarGraph(this.averagesOne, 'radarGraph');

      this.$http.get('/api/users/assessment/' + this.userIdTwo + '/' + this.clientIdTwo + '/' + this.assessmentIdTwo)
      .then(response => {
        this.assessmentTwo = response.data;
        this.formTwo = this.assessmentTwo.assessment[0];
        this.maxTwo = this.assessmentTwo.assessment.length;
        this.averagesTwo = this.scores.averages(this.assessmentTwo.assessment);
        this.graph.paintRadarGraph(this.averagesTwo, 'radarGraph2');
        this.paintAllGraphs();
        this.dataLoaded = true;
      })
    });
  }//End onInit

  clearCanvas() {
    var saCanvas = document.getElementById('saLine'), qaCanvas = document.getElementById('qaLine');
    var lsaCanvas = document.getElementById('saLine2'), lqaCanvas = document.getElementById('qaLine2');
    var saCon = document.getElementById('lsa'), qaCon = document.getElementById('lqa');
    var lsaCon = document.getElementById('lsa2'), lqaCon = document.getElementById('lqa2');
    var c1 = document.createElement('canvas'), c2 = document.createElement('canvas');
    var l1 = document.createElement('canvas'), l2 = document.createElement('canvas');
    saCanvas.remove();
    qaCanvas.remove();
    lsaCanvas.remove();
    lqaCanvas.remove();
    c1.id = 'saLine', c1.className = 'graph-padding-two';
    c2.id = 'qaLine', c2.className = 'graph-padding-two';
    l1.id = 'saLine2', l1.className = 'graph-padding-two';
    l2.id = 'qaLine2', l2.className = 'graph-padding-two';
    saCon.appendChild(c1);
    qaCon.appendChild(c2);
    lsaCon.appendChild(l1);
    lqaCon.appendChild(l2);
  }//End clearCanvas

  paintAllGraphs() {
    var saObj = this.scores.countSAResponse(this.formOne);
    this.saLengthOne = saObj.saLength;
    var saCounts = saObj.saCounts;
    var saScoreObj = this.scores.countSAScores(this.formOne);
    var qaScoreObj = this.scores.countQAScores(this.formOne);
    var saObj2 = this.scores.countSAResponse(this.formTwo);
    this.saLengthTwo = saObj2.saLength;
    var saCounts = saObj.saCounts;
    var saScoreObj2 = this.scores.countSAScores(this.formTwo);
    var qaScoreObj2 = this.scores.countQAScores(this.formTwo);
    this.graph.paintLineGraph(saScoreObj, 'saLine');
    this.graph.paintLineGraph(qaScoreObj, 'qaLine');
    this.graph.paintLineGraph(saScoreObj2, 'saLine2');
    this.graph.paintLineGraph(qaScoreObj2, 'qaLine2');
  }//End paintAllGraphs

  savePDF() {
    this.pdf.convertToPDF(this.form, this.clientName);
  }//End savePDF

  next() { 
    ++this.formIndexOne;
    this.formOne = this.assessmentOne.assessment[this.formIndexOne];
    this.saLengthOne = 0;
    ++this.formIndexTwo;
    this.formTwo = this.assessmentTwo.assessment[this.formIndexTwo];
    this.saLengthTwo = 0;
    this.clearCanvas();
    this.paintAllGraphs();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }//End next

  prev() { 
    --this.formIndexOne;
    this.formOne = this.assessmentOne.assessment[this.formIndexOne];
    this.saLength = 0;
    --this.formIndexTwo;
    this.formTwo = this.assessmentTwo.assessment[this.formIndexTwo];
    this.saLengthTwo = 0;
    this.clearCanvas();
    this.paintAllGraphs();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }//End prev

  checkMax() {
    if (this.formIndexOne >= this.maxOne - 1) {
      return true;
    }   
    return false;
  }//End checkMax

  checkMin() {
    if (this.formIndexOne <= 0) {
      return true;
    }
    return false;
  }//End checkMin
} //End CompareToolComponent