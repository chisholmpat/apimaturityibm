'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './clients.routes';
import NewAssessment from './new_assessment';

export class ClientsComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.clients = {};
    this.client = {};
    this.newClient = {};
    this.nameCopy = 'Start adding clients!';
    this.selected = 1;
    this.count = 0;
    this.update = false;
  }//End constructor

  $onInit() {
    this.$http.get('/api/users/me').then(response => {
      this.user = response.data;
      this.clients = this.user.clients;

      if (this.clients.length > 0) {
        this.noClients = true;
        this.client = this.clients[0]; 
        this.nameCopy = this.client.name;
      } else {
        this.noClients = false;
      }
    })
  }//End onInit

  saveClient(client) {
    this.$http.post('/api/users/clientNew/' + this.user._id, client).then(response => {
      this.clients.push(response.data.clients[response.data.clients.length - 1]);
      this.client = this.clients[this.clients.length - 1];
      this.nameCopy = client.name;
      this.newClient = {};
      this.noClients = true;
      this.client.edit = !this.client.edit;
    });
  }//End addForm

  updateClient(client) {
    this.$http.put('/api/users/clientUpdate/' + this.user._id + '/' + client._id, client)
    .success(function() {
      client.edit = false;
    })
    .error(function(err) {
      alert('An error occured while saving your changes. Please try again.');
    });
  }//End editForm

  deleteClient(client) {
    this.$http.delete('/api/users/clientDelete/' + this.user._id + '/' + client._id)
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
  }//End deleteForm

  selectClient(client) {
    this.noClients = true;
    this.nameCopy = client.name;
    this.client = client;
  }//End selectClient

  toggleEdit(client) {
    client.edit = !client.edit;
  }//End toggleEdit

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
}//End controller

export default angular.module('apiLocalApp.clients', [uiRouter, NewAssessment])
  .config(routes)
  .component('clients', {
    template: require('./clients.html'),
    controller: ClientsComponent,
    controllerAs: 'clientsCtrl'
  })
  .name;
