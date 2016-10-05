'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './forms.routes';

export class FormsComponent {
  $http;
  socket;
  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$scope = $scope;
    this.socket = socket;
    this.user = {};
    this.forms = [];
    this.formsCopy = [];
    this.name = 'Forms';
    this.count = 0;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('form');
    });
  }//Constructor

  $onInit() {
    // this.$http.get('/api/forms').then(response => {
    //   this.forms = response.data;
    //   this.socket.syncUpdates('form', this.forms);
    // });


    // this.$http.get('/api/users/me').then(response => {
    //   this.user = response;
    //   // var i = 0, a = 0, f = 0, q = 0;
    //   this.clients = [], this.assessments = [], this.formsCopy = [];
    //   console.log(this.user.data.clients[0]._id);

    //   this.$http.get('/api/users/clientList/' + this.user.data._id + '/' + this.user.data.clients[0]._id).then(response => {
    //     console.log(response);
    //     console.log('hello');
    //   });

    //   this.$http.get('/api/users/forms/' + this.user.data._id).then(response => {
    //     console.log(response.data);
    //     this.formsCopy = response.data;

    //   });
    // });//End get me
  }//End onInit

  saveForm(form) {
    this.user.data.clients[0].assessments[0].assessment.push(form);
    this.$http.put('/api/users/forms/' + this.user.data._id, this.user.data).then(response => {
      this.user = response;
      var l = response.data.clients[0].assessments[0].assessment.length;
      console.log(response.data.clients[0].assessments[0].assessment[l]);
      // this.formsCopy.push(response.data.clients[0].assessments[0].assessment[assessment.length - 1]);
      console.log(this.user);
    });

  }//End addForm

  updateForm(form) {
    this.$http.put('/api/forms/' + form._id, form)
    .success(function() {
      form.edit = false;
    })
    .error(function(err) {
      alert('An error occured while saving your changes. Please try again.');
    });
  }//End editForm

  deleteForm(form) {
    this.$http.delete('/api/forms/' + form._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.forms.splice(this.forms.indexOf(form), 1);
  }//End deleteForm

  toggleEdit(form) {
    form.edit = !form.edit;
  }//End toggleEdit

  questionCount(form) {
  this.count = 0;
  var q = form.questions;
  
  for (var j=0, jLen=q.length; j<jLen; j++) {
    ++this.count;
  }//End nFor
  
  return this.count;
  }//End questionCount
}//End controller

FormsComponent.$inject = ["$http", "$scope", "socket", "$filter"];

export default angular.module('apiLocalApp.forms', [uiRouter])
  .config(routes)
  .component('forms', {
    template: require('./forms.html'),
    controller: FormsComponent,
    controllerAs: 'formsCtrl'
  })
  .name;
