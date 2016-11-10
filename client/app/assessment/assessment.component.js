'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './assessment.routes';

export class AssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, $state, Auth) {
    this.$http = $http;
    this.$cookies = $cookies;
    this.$state = $state;
    this.template = null;
    this.idCopies = [];
    this.formIndex = 0;
    this.max = 0;
    this.currentId = '';
  }//End constructor

  $onInit() {    
    this.$http.get('/api/assessments/')
    .then(response => {
      this.template = response.data[0];
      this.max = this.template.assessment.length;

      for (var i = 0; i < this.template.assessment.length; i++) {
        this.idCopies[i] = this.template.assessment[i]._id;
      }
      this.currentId = this.idCopies[0];
    })
  }//End onInit

  getResult() {  
    this.$state.go('finishedAssessment');
  }//End saveAssessment

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
}//End newAssessmentComponent

export default angular.module('apiLocalApp.assessment', [uiRouter])
.config(routes)
.component('assessment', {
  template: require('./assessment.html'),
  controller: AssessmentComponent,
  controllerAs: 'assessmentCtrl'
})
.name;
