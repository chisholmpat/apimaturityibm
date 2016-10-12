'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './builder.routes';

export class BuilderComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.templates = {};
    this.template = {};
    this.newTemplate = {};
  }//End constructor

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.userId = response.data._id;
      this.templates = response.data.assessmentTemplates;
      this.template = this.templates[0];
      this.detailCount(this.template);
    })//End get
  }//End onInit

  saveTemplate(template) {
    this.$http.post('/api/users/templateNew/' + this.userId, template).then(response => {
      this.templates.push(response.data[response.data.length - 1]);
      this.template = this.templates[this.templates.length - 1];
      this.newTemplate = {};
    });
  }//End addForm

  deleteTemplate(template) {
    this.$http.delete('api/users/templateDelete/' + this.userId + '/' + template._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.templates.splice(this.templates.indexOf(template), 1);
  }//End deleteTemplate

  selectTemplate(template) {
    this.template = template;
    this.detailCount(template);
  }//End selectTemplate

  setInfo() {
    this.$cookies.put('templateId', this.template._id);
    this.$cookies.put('templateName', this.template.name);
  }

  detailCount(template) { 
    this.fCount = 0, this.qCount = 0;
    
    for (var i = 0; i < template.assessment.length; i++) {
      ++this.fCount;
      for (var j = 0; j < template.assessment[i].questions.length; j++) {
        ++this.qCount;
      }
    }

    return this.count;
  }//End detailCount
}//End BuilderComponent

export default angular.module('apiLocalApp.builder', [uiRouter])
  .config(routes)
  .component('builder', {
    template: require('./builder.html'),
    controller: BuilderComponent,
    controllerAs: 'builderCtrl'
  })
  .name;
