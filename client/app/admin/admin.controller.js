'use strict';

import AddUserController from './modal_components/modal_add.controller'

export default class AdminController {
  /*@ngInject*/
  constructor(User, $http, $uibModal, $document) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.users = null;
    this.user = null;
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
    })
  }//End onInit

  delete(user) {
    this.$http.delete('api/users/' + user._id)
    .error(function(err) {
      alert('Something went wrong while deleting. Please try again later.');
    })
    this.users.splice(this.users.indexOf(user), 1);
    this.user = this.users[0];
    this.total = this.users.length;
  }//End delete

  paginate(val) {
    var begin, end, index;
    begin = (this.currentPage - 1) * this.usersPerPage;
    end = begin + this.usersPerPage;
    index = this.users.indexOf(val);
    return (begin <= index && index < end);
  }//End paginate

  selectUser(user) {
    this.user = user;
  }//End selectUser

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
}//End controller
