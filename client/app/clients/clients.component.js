'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './clients.routes';

import AddClientController from './modal_components/modal_add.controller'

import ClientHistoryController from './modal_components/modal_history.controller'

import NewAssessmentController from './modal_components/modal_new.controller'

import StartCompareController from './modal_components/modal_compare.controller'

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
    this.editCopy = null;
    this.templates = null;
    this.selected = 1;
    this.count = 0;
    this.update = false;
    this.animationEnabled = true;
    this.alerts = [
      { type: 'danger', msg: "You haven't added any clients, please add a client to begin." }
    ];
  }//End constructor

  $onInit() {
    this.$http.get('/api/users/client/' + this.userId)
    .then(response => {
      this.clients = response.data;

      if (this.clients.length > 0) {
        this.noClients = true;
        this.client = this.clients[0]; 
      } else {
        this.noClients = false;
        this.alertTrigger = true;
      }
      this.dataLoaded = true;
    })//End get

    this.$http.get('api/users/template/' + this.userId)
    .then(response => {
      this.templates = response.data;
    })//End get
  }//End onInit

   checkForm(f) {
    this.submitted = true;

    if (f.$valid) {
      this.$http.put('/api/users/clientUpdate/' + this.userId + '/' + this.client._id, this.client)
      .error(function(err) {
        alert('An error occured while saving your changes. Please try again.');
      });
      this.client.edit = false;
    } else {
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

    if (this.clients.length <= 0) {
      this.nameCopy = 'Start adding clients!';
      this.noClients = false;
      this.client = null;
    } else {
      this.client = this.clients[0]; 
    }//End if
  }//End deleteClient

  selectClient(client) {
    this.noClients = true;
    this.client = client;
  }//End selectClient

  toggleEdit(client) {
    client.edit = !client.edit;
    this.editCopy = angular.copy(client);
  }//End toggleEdit

  cancelEdit(client) {
    this.client = angular.copy(this.editCopy);
    this.client.edit = !this.client.edit;
    this.submitted = false;
  }//End cancelEdit

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

  toggleModal() {
    var clients = this.clients, client = this.client, userId = this.userId,
      noClients = this.noClients, thisCtrl = this;

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

    modalInstance.result.then(function (saved) {
      if (saved) {
        thisCtrl.client = thisCtrl.clients[thisCtrl.clients.length - 1];
        thisCtrl.noClients = true;
      }//End if
    });
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
  }//End toggleModalThree

  toggleModalFour() {
    var clients = this.clients;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_compare.html'),
      controller: StartCompareController,
      controllerAs: 'comCtrl',
      resolve: {
        clients: function() {
          return clients;
        }
      }
    })//End open
  }//End toggleModalThree
}//End controller

export default angular.module('apiLocalApp.clients', [uiRouter])
  .config(routes)
  .component('clients', {
    template: require('./clients.html'),
    controller: ClientsComponent,
    controllerAs: 'clientsCtrl'
  })
  .name;
