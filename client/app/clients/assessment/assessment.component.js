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
  }//End constructor

  $onInit() {      
    this.$http.get('/api/users/assessment/' + this.userId + '/' + this.clientId + '/' + this.assessmentId)
    .then(response => {
      this.assessment = response.data;
    })
  }//End onInit
} //End AssessmentsComponent