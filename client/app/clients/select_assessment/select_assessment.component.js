'use strict';

export default class SelectAssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = this.$cookies.get('userId');
    this.clientId = this.$cookies.get('clientId');
    this.clientName = this.$cookies.get('clientName');
    this.date = Date.now();
    this.selection = null;
    this.assessmentName = '';
    this.templateId;
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/' + this.userId)
    .then(response => {
      this.templates = response.data;
    })
  }//End onInit

  checkTemplate() {
    if (this.selection == null) {
      return true;
    } else if (this.assessmentName.length < 6) {
      return true;
    }
  }

  setInfo() {
      this.$cookies.put('templateId', this.selection);
      this.$cookies.put('newAssessmentName', this.assessmentName);
  }//End setInfo
} //End SelectAssessmentComponent