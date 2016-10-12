'use strict';

export default class HistoryComponent {
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
    this.assessments = {};
  }//End constructor

  $onInit() {      
    this.$http.get('/api/users/assessment/' + this.userId + '/' + this.clientId).then(response => {
      this.assessments = response.data;
    })
  }//End onInit

  deleteAssessment(assessment) {
    this.$http.delete('/api/users/assessmentDelete/' + this.userId + '/' + this.clientId + '/' + assessment._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.assessments.splice(this.assessments.indexOf(assessment), 1);
  }//End deleteAssessment

  setInfo(assessment) {
    this.$cookies.put('assessmentId', assessment._id);
    this.$cookies.put('assessmentName', assessment.name);
  }
} //End AssessmentsComponent