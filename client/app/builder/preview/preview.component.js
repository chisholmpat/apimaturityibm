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
    this.template = null;
    this.idCopies = [];
    this.formIndex = 0;
    this.max = 0;
    this.currentId = '';
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/' + this.userId + '/' + this.templateId)
    .then(response => {
      this.template = response.data;
      console.log(this.template);
      this.max = this.template.assessment.length;

      for (var i = 0; i < this.template.assessment.length; i++) {
        this.idCopies[i] = this.template.assessment[i]._id;
      }
      this.currentId = this.idCopies[0];
    })
  }//End onInit

  next() { 
    if (this.formIndex >= this.max - 1) {
      this.formIndex = 0;
      this.currentId = this.idCopies[this.formIndex];
    } else {
      this.formIndex++;
      this.currentId = this.idCopies[this.formIndex];
    }
  }//End next

  prev() { 
    if (this.formIndex <= 0) {
      this.formIndex = this.max - 1;
      this.currentId = this.idCopies[this.formIndex];
    } else {
      this.formIndex--;
      this.currentId = this.idCopies[this.formIndex];
    }
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