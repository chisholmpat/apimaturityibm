'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './forms.routes';

export class FormsComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.forms = [];
    this.name = 'Forms';
    this.count = 0;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('form');
    });
  }//Constructor

  $onInit() {
    this.$http.get('/api/forms').then(response => {
      this.forms = response.data;
      this.socket.syncUpdates('form', this.forms);
    });
  }//End onInit

  addForm(form) {
    this.$http.post('/api/forms', form).then(response => {
      form = response.data;
      this.forms.push(form);
      this.form = null;
    });
  }//End addForm

  editForm(form) {
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
  // .component('forms.single', {
  //   template: require('./forms.single.html'),
  //   controller: SingleFormComponent,
  //   controllerAs: 'singleCtrl'
  // })
  .name;
