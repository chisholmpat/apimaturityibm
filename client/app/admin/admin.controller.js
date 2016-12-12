'use strict';

import AddUserController from './modal_components/modal_add.controller'

import ClientDetailsController from './modal_components/modal_details.controller'

export default class AdminController {
  /*@ngInject*/
  constructor(User, $http, $uibModal, $document) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.users = null;
    this.user = null;
    this.editCopy = null;
    this.count = 0;
    this.animationEnabled = true;
    this.total = null;
    this.currentPage = 1;
    this.usersPerPage = 1;
  }

  $onInit() {
    this.$http.get('api/users/')
    .then(response => {
      this.users = response.data;
      this.user = this.users[0];
      this.total = this.users.length;
      this.dataLoaded = true;
    })
  }//End onInit

  delete(user) {
    if (confirm('Are you sure you want to deactivate ' + user.name + '?')) {
      this.$http.put('api/users/setActive/' + user._id)
      .error(function(err) {
        alert('Something went wrong while deleting. Please try again later.');
      })
      this.users.splice(this.users.indexOf(user), 1);
      this.user = this.users[0];
      this.total = this.users.length;
    }
  }//End delete

  checkForm(f) {
    if (f.$valid) {
      this.$http.put('/api/users/admin/' + this.user._id, this.user)
      .error(function(err) {
        alert('An error occured while saving your changes. Please try again.');
      });
      this.user.edit = false;
    } else {
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });    
    }//End if
  }//End update

  selectUser(user) {
    this.user = user;
  }//End selectUser

  toggleEdit(user) {
    user.edit = !user.edit;
    this.editCopy = angular.copy(user);
  }//End toggleEdit

  cancelEdit(user) {
    this.user = angular.copy(this.editCopy);
    this.user.edit = !this.user.edit;
  }//End cancelEdit

  deleteClient(client) {
    if (confirm('Are you sure you want to delete ' + client.name + '?')) { 
      this.$http.delete('/api/users/clientDelete/' + this.user._id + '/' + client._id)
      .error(function(err) {
        alert('An error occured while deleting. Please try again.');
      });
      this.user.clients.splice(this.user.clients.indexOf(client), 1);
    }
  }//End deleteClient

  countClients(user) {
  	this.count = 0;

  	for (var i = 0; i < user.clients.length; i++) {
  		++this.count;
  	}

  	return this.count;
  }//End countClients

  toggleAddModal() {
    var users = this.users;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_add.html'),
      controller: AddUserController,
      controllerAs: 'addCtrl',
      resolve: {
        users: function() {
          return users;
        }
      }
    })//End open
  }//End toggleAddModal 

  toggleDetailsModal(client) {
    var clientCopy = client, userId = this.user._id;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_details.html'),
      controller: ClientDetailsController,
      controllerAs: 'detailsCtrl',
      resolve: {
        clientCopy: function() {
          return clientCopy;
        },
        userId: function() {
          return userId;
        }
      }
    })//End open
  }//End toggleDetailsModal 
}//End controller
