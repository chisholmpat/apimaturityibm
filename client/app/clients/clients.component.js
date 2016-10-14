'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './clients.routes';

import AddClientController from './modal_components/modal_add.controller'

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
    })
  }//End onInit

  updateClient(client) {
    this.$http.put('/api/users/clientUpdate/' + this.userId + '/' + client._id, client)
    .success(function() {
      client.edit = false;
    })
    .error(function(err) {
      alert('An error occured while saving your changes. Please try again.');
    });
  }//End updateClient

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

  select(item) {
    this.selected = item;
  }//End select

  isSelected(item) {
    return this.selected == item;
  }//End isSelected

  assessmentCount(client) {
    this.count = 0;
  
    for (var i = 0; i < client.assessments.length; i++) {
      ++this.count;
    }

    return this.count;
  }//End assessmentCount

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
}//End controller

export default angular.module('apiLocalApp.clients', [uiRouter])
  .config(routes)
  .component('clients', {
    template: require('./clients.html'),
    controller: ClientsComponent,
    controllerAs: 'clientsCtrl'
  })
  .name;
