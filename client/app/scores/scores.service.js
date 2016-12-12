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
    switch (q.answer || q.score) {
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
    switch (q.answer || q.score) {
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

  scores.countSAScores = function(form) {
  	var self = this;
    var scoreObj = {};
    var qs = form.questions, scores = [], uScores = [], labels = [], maxScores = [], i = 0;

    qs.forEach(function(q) {
      if (q.category === "Self-Assessment") {
        ++i;

        if (q.ticks != undefined) {
          var score = self.calcScore(q.score, q.weight);
          uScores.push(q.score);
        } else {
          var score = self.calcScore(q.answer, q.weight);
          uScores.push(q.answer);
        }//End nested if

        var qLabel = 'Q:'+i;
        maxScores.push(3);
        scores.push(score);
        labels.push(qLabel);
      }//End if
    });//End for

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

        if (q.ticks != undefined) {
          var score = self.calcScore(q.score, q.weight);
          uScores.push(q.score);
        } else {
          var score = self.calcScore(q.answer, q.weight);
          uScores.push(q.answer);
        }//End nested if

        var qLabel = 'Q:'+i;
        maxScores.push(5);
        scores.push(score);
        labels.push(qLabel);
      }//End if
    });//End for

    scoreObj.uScores = uScores;
    scoreObj.scores = scores;
    scoreObj.labels = labels;
    scoreObj.maxScores = maxScores;

    return scoreObj;
  }//End countScores

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

      var saFormScore = Math.round(saTotal / saIndex), qaFormScore = Math.round(qaTotal / qaIndex);
      saScores.push(saFormScore);
      qaScores.push(qaFormScore);
      saIndex = 0, qaIndex = 0, saTotal = 0, qaTotal = 0;
    });

    dataObj.labels = labels;
    dataObj.saScores = saScores;
    dataObj.qaScores = qaScores;

    return dataObj;
  }//End saAverages

  scores.allAverages = function(assessments) {
    var self = this;
    var dataObj = {}, assessmentCopy = [{}];
    var labels = [], saScores = [0,0,0,0,0,0], qaScores = [0,0,0,0,0,0];
    var saIndex = 0, qaIndex = 0, saTotal = 0, qaTotal = 0, i = 0, fCount = 0;
    var qCount = 0;
    var saTotalArr = [], qaTotalArr = [];

    assessments.forEach(function(as) {
      as.assessment.forEach(function(f) {
        //Copy the labels on the first form since we are comparing default template (Static)
        //On first loop, make temp form objects that will hold the average individual scores
        //for each question
        if (i == 0) {
          labels.push(f.name);
          var tempForm = {};
          tempForm.name = f.name
          tempForm.questions = [];
          assessmentCopy[fCount] = tempForm;
        }

        //Calc average scores for each form by category by
        //summing the result of each question score
        f.questions.forEach(function(q) {
          if (q.category === "Self-Assessment") {
            var score = self.calcScore(q.answer, q.weight);
            saTotal += score;
            ++saIndex;

            //On first loop, copy all questions, else keep tallying the score for each
            //instance of the question for this assessment
            if (i == 0) {
              var tempQuestion = {};
              tempQuestion.question = q.question;
              tempQuestion.category = q.category;
              tempQuestion.weight = q.weight;
              tempQuestion.score = score;
              tempQuestion.ticks = 1;
              assessmentCopy[fCount].questions.push(tempQuestion);
              ++qCount;
            } else {
              assessmentCopy[fCount].questions[qCount].score += score;
              assessmentCopy[fCount].questions[qCount].weight += q.weight;
              ++assessmentCopy[fCount].questions[qCount].ticks;
              ++qCount;
            }//End nested if
          } else if (q.category === "Quantitative-Assessment") {
            var score = self.calcScore(q.answer, q.weight);
            qaTotal += score;
            ++qaIndex;

            if (i == 0) {
              var tempQuestion = {};
              tempQuestion.question = q.question;
              tempQuestion.category = q.category;
              tempQuestion.weight = q.weight;
              tempQuestion.score = score;
              tempQuestion.ticks = 1;

              assessmentCopy[fCount].questions.push(tempQuestion);
              ++qCount;
            } else {
              assessmentCopy[fCount].questions[qCount].score += score;
              assessmentCopy[fCount].questions[qCount].weight += q.weight;
              ++assessmentCopy[fCount].questions[qCount].ticks;
              ++qCount;
            }//End nested if
          }//End if
        })//End forEach (questions)

        //Calculate average score for each form (Sum of scores by cat / # questions)
        var saFormScore = saTotal / saIndex, qaFormScore = qaTotal / qaIndex;
        //Make temp array containing form averages for SA & QA scores
        saTotalArr.push(saFormScore);
        qaTotalArr.push(qaFormScore);
        //Reset scores and counters for next form
        saIndex = 0, qaIndex = 0, saTotal = 0, qaTotal = 0;
        ++fCount;
        qCount = 0;
      })//End forEach (forms)

      //Copy averages for this form to global arr
      for (var x = 0; x < saTotalArr.length; x++) {
        saScores[x] += saTotalArr[x];
        qaScores[x] += qaTotalArr[x];
      }//End for

      //Reset temp arrays to avoid NaN errors
      saTotalArr = [], qaTotalArr = [];
      ++i;
      fCount = 0;
    });//End forEach (assessments)

    //Loop through all scores arrays and divide the totals by the number of assessments 
    //matching the this criteria
    for (var x = 0; x < saScores.length; x++) {
      saScores[x] = Math.round(saScores[x] / i);
      qaScores[x] = Math.round(qaScores[x] / i);
    }//End for

    //Get score in survey range byh dividing score by ticks,
    //round to whole number
    assessmentCopy.forEach(function(f) {
      f.questions.forEach(function(q) {
        q.score = Math.round(q.score / q.ticks);
        q.weight = Math.round(q.weight / q.ticks);
      });//End nested for
    });//End for

    //Return all values in object
    dataObj.labels = labels;
    dataObj.saScores = saScores;
    dataObj.qaScores = qaScores;
    dataObj.assessmentCopy = assessmentCopy;
    return dataObj;
  }//End allAverages
}//End service

export default angular.module('apiLocalApp.scores', [])
.service('scores', scoresService)
.name;
