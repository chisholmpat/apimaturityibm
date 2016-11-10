import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

import NewAssessmentController from './modal_components/modal_assessment.controller';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, $cookies, Auth, socket, $uibModal, $document) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.userId = this.$cookies.get('userId');
    this.animationEnabled = true;
  }

  $onInit() {

  }

  newAssessment() { 
    this.$http.get('/api/users/client/' + this.userId)
    .then(response => { 
      this.clients = response.data;
      this.$http.get('api/users/template/' + this.userId)
      .then(response => {
        this.templates = response.data;
        this.toggleModalOne();
      });
    });
  }

  toggleModalOne() {
    var clients = this.clients, templates = this.templates, userId = this.userId;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_assessment.html'),
      controller: NewAssessmentController,
      controllerAs: 'nasCtrl',
      resolve: {
        clients: function() {
          return clients;
        },  
        templates: function() {
          return templates;
        },
        userId: function() {
          return userId;
        }
      }
    })//End open
  }//End toggleModalOne
}//End controller

export default angular.module('apiLocalApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: 'mainCtrl'
  })
  .name;
