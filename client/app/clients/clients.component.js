'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './clients.routes';

export class ClientsComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.clients = {};
    this.client = {
      name: 'New Client'
    };
    this.Auth = Auth;
    this.selected = 1;
    this.count = 0;
    this.update = false;
  }//End constructor

  $onInit() {
    this.$http.get('/api/clients').then(response => {
      this.clients = response.data;
      // this.client = this.clients[0];
      this.socket.syncUpdates('form', this.forms);
    });//End get
    this.user = this.Auth.getCurrentUser().name;
  }//End onInit

  saveClient(client) {
    this.$http.post('/api/clients', client).then(response => {
      client = response.data;
      this.clients.push(client);
    });
  }//End addForm

  updateClient(form) {
    this.$http.put('/api/clients/' + client._id, client)
    .success(function() {
      client.edit = false;
    })
    .error(function(err) {
      alert('An error occured while saving your changes. Please try again.');
    });
  }//End editForm

  deleteClient(client) {
    this.$http.delete('/api/clients/' + client._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.clients.splice(this.clients.indexOf(client), 1);
  }//End deleteForm

  selectClient(client) {
    this.client = client;
  }//End selectClient

  addNew(client) {
    client.edit = !client.edit;
    client = {
      _id: null,
      name: 'New Client',
      contact: '',
      country: '',
      phone: '',
      email: '',
      industry: '',
      industry_segment: '',
      revenue: 0,
      market_share: 0,
      market_capitalization: 0,
      competitors: ''
    };
  }//End addNew

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
    var q = client.assessments;
  
    for (var j=0, jLen=q.length; j<jLen; j++) {
      ++this.count;
    }//End nFor

    return this.count;
  }//End assessmentCount
}//End controller

export default angular.module('apiLocalApp.clients', [uiRouter])
  .config(routes)
  .component('clients', {
    template: require('./clients.html'),
    controller: ClientsComponent,
    controllerAs: 'clientsCtrl'
  })
  .name;
