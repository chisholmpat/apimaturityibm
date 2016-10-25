'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './clients.routes';

import AddClientController from './modal_components/modal_add.controller'

import ClientHistoryController from './modal_components/modal_history.controller'

import NewAssessmentController from './modal_components/modal_new.controller'

export class ClientsComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, $uibModal, $document, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = this.$cookies.get('userId');
    this.clients = null;
    this.client = null;
    this.templates = null;
    this.selected = 1;
    this.count = 0;
    this.update = false;
    this.nameCopy = 'Start adding clients!';
  }//End constructor

  $onInit() {
    this.$http.get('/api/users/client/' + this.userId).then(response => {
      this.clients = response.data;

      if (this.clients.length > 0) {
        this.noClients = true;
        this.client = this.clients[0]; 
        this.nameCopy = this.client.name;
      } else {
        this.noClients = false;
      }
    })//End get

    this.$http.get('api/users/template/' + this.userId)
    .then(response => {
      this.templates = response.data;
    })//End get
  }//End onInit

   checkForm(f) {
    if (f.$valid) {
      this.$http.put('/api/users/clientUpdate/' + this.userId + '/' + this.client._id, this.client)
      .error(function(err) {
        alert('An error occured while saving your changes. Please try again.');
      });
      this.client.edit = false;
      this.alertTrigger = false;
    } else {
      this.alertTrigger = true;
      this.alerts = [
        { type: 'danger', msg: 'Some details were incorrect. Please review the errors and try again.' }
      ];
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });    
    }//End if
  }//End checkForm

  deleteClient(client) {
    this.$http.delete('/api/users/clientDelete/' + this.userId + '/' + client._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.clients.splice(this.clients.indexOf(client), 1);

    if (this.clients.length == 0) {
      this.nameCopy = 'Start adding clients!';
      this.noClients = false;
    } else {
      this.client = this.clients[0]; 
    }
  }//End deleteClient

  selectClient(client) {
    this.noClients = true;
    this.nameCopy = client.name;
    this.client = client;
  }//End selectClient

  toggleEdit(client) {
    client.edit = !client.edit;
  }//End toggleEdit

  setInfo() {
    this.$cookies.put('clientId', this.client._id);
    this.$cookies.put('clientName', this.client.name);
  }//End setInfo

  assessmentCount(client) {
    this.count = 0;
  
    for (var i = 0; i < client.assessments.length; i++) {
      ++this.count;
    }

    return this.count;
  }//End assessmentCount

  closeAlert(index) {
    this.alerts.splice(index, 1);
  };//End closeAlert

  toggleModal() {
    var clients = this.clients, userId = this.userId;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_add.html'),
      controller: AddClientController,
      controllerAs: 'addCtrl',
      resolve: {
        clients: function() {
          return clients;
        },
        userId: function() {
          return userId;
        }
      }
    })//End open
  }//End toggleModal

  toggleModalTwo() {
    var client = this.client;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_history.html'),
      controller: ClientHistoryController,
      controllerAs: 'histCtrl',
      resolve: {
        client: function() {
          return client;
        }
      }
    })//End open
  }//End toggleModalTwo

  toggleModalThree() {
    var client = this.client, templates = this.templates;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_new.html'),
      controller: NewAssessmentController,
      controllerAs: 'newCtrl',
      resolve: {
        client: function() {
          return client;
        },
        templates: function() {
          return templates;
        }
      }
    })//End open
  }//End toggleModalTwo
}//End controller

export default angular.module('apiLocalApp.clients', [uiRouter])
  .config(routes)
  .component('clients', {
    template: require('./clients.html'),
    controller: ClientsComponent,
    controllerAs: 'clientsCtrl'
  })
  .name;
