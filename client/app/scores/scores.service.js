'use strict';
const angular = require('angular');

/*@ngInject*/
export function scoresService() {
	var scores = this;

	scores.calcScore = function(answer, weight) {
    if ((answer == 2 || answer == 3) && (weight == 2 || weight == 3)) {
      return answer - 1;
    } else {
      return answer;
    }//End if
  }//End calcScore

  scores.setSAResponse = function(q) {
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

  scores.setQAResponse = function(q) {
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

  scores.countSAScores = function(form) {
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

  scores.countQAScores = function(form) {
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

  scores.countSAResponse = function(form) {
  	var countObj = {
  		saCounts: [0,0,0],
  		saLength: 0
  	};

    for (var j = 0; j < form.questions.length; j++) {
      if (form.questions[j].category === 'Self-Assessment') {
        ++countObj.saLength;
        switch (form.questions[j].answer) {
          case 1: 
          ++countObj.saCounts[0];
          break;
          case 2: 
          ++countObj.saCounts[1];
          break;
          case 3: 
          ++countObj.saCounts[2];
          break;
        }//End switch
      }//End if
    }//End for

    return countObj;
  }//End countSAResponse

  scores.countQAResponse = function(form) {
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

  scores.averages = function(assessment) {
    var self = this;
    var labels = [], saScores = [], qaScores = [], dataObj = {};
    var saIndex = 0, qaIndex = 0, saTotal = 0, qaTotal = 0;

    assessment.forEach(function(f) {
      labels.push(f.name);

      f.questions.forEach(function(q) {
        if (q.category === "Self-Assessment") {
          var score = self.calcScore(q.answer, q.weight);
          saTotal += score;
          ++saIndex;
        }
        else if (q.category === "Quantitative-Assessment") {
          var score = self.calcScore(q.answer, q.weight);
          qaTotal += score;
          ++qaIndex;
        }
      })

      var saFormScore = saTotal / saIndex, qaFormScore = qaTotal / qaIndex;
      saScores.push(saFormScore);
      qaScores.push(qaFormScore);
      saIndex = 0, qaIndex = 0, saTotal = 0, qaTotal = 0;
    });

    dataObj.labels = labels;
    dataObj.saScores = saScores;
    dataObj.qaScores = qaScores;

    return dataObj;
  }//End saAverages
}//End service

export default angular.module('apiLocalApp.scores', [])
  .service('scores', scoresService)
  .name;
