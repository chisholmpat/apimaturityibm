'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './assessments.routes';

export class AssessmentsComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.forms = [];
    this.message = 'Hello';
  }//End constructor

  $onInit() {
    this.$http.get('/api/forms').then(response => {
      this.forms = response.data;
      this.socket.syncUpdates('form', this.forms);
    });//End get
  }//End onInit
  
}//End controller

AssessmentsComponent.$inject = ["$http", "$scope", "socket", "$filter"];

export default angular.module('apiLocalApp.assessments', [uiRouter])
  .config(routes)
  .component('assessments', {
    template: require('./assessments.html'),
    controller: AssessmentsComponent,
    controllerAs: 'assessmentsCtrl'
  })
  .name;
