import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, Auth, socket) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  $onInit() {

  }
}

export default angular.module('apiLocalApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
