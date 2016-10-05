'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './builder.routes';

export class BuilderComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.templates = {};
    this.template = {};
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.templates = response.data.assessmentTemplates;
    })
  }

  
}

export default angular.module('apiLocalApp.builder', [uiRouter])
  .config(routes)
  .component('builder', {
    template: require('./builder.html'),
    controller: BuilderComponent,
    controllerAs: 'builderCtrl'
  })
  .name;
