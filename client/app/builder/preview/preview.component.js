'use strict';

export default class PreviewComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = this.$cookies.get('userId');
    this.templateId = this.$cookies.get('templateId');
    this.templateName = this.$cookies.get('templateName');
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/' + this.userId + '/' + this.templateId)
    .then(response => {
      this.template = response.data;
      console.log(this.template);
    })
  }//End onInit
} //End AssessmentsComponent