'use strict';

export default class HistoryComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = $scope.$resolve.$stateParams.userId;
    this.clientId = $scope.$resolve.$stateParams.clientId;
    this.assessments = {};
  }//End constructor

  $onInit() {      
    this.$http.get('/api/users/client/' + this.userId + '/' + this.clientId).then(response => {
      this.client = response.data;
      this.assessments = this.client.assessments;
    })
  }//End onInit

  deleteAssessment(assessment) {

  }//End deleteAssessment
} //End AssessmentsComponent