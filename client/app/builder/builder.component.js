'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './builder.routes';

import AddTemplateController from './modal_components/modal_add.controller'

export class BuilderComponent {
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
    this.templates = null;
    this.template = null;
    this.form = null;
    this.formsExist = true;
    this.animationEnabled = true;
    this.idCopies = [];
    this.max = 0, this.formIndex = 0;
  }//End constructor

  $onInit() {
    this.$http.get('api/users/template/' + this.userId)
    .then(response => {
      this.templates = response.data;
      this.template = this.templates[0];
      this.detailCount(this.template);
      this.max = this.template.assessment.length;
      this.form = this.template.assessment[0];
      this.dataLoaded = true;
    });
  }//End onInit

  deleteTemplate(template) {
    this.$http.delete('api/users/templateDelete/' + this.userId + '/' + template._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.templates.splice(this.templates.indexOf(template), 1);
    this.template = this.templates[0];
    this.detailCount(template);
    if (this.template.assessment.length > 0) {
      this.formsExist = true;
      this.form = this.template.assessment[0];
      this.max = this.template.assessment.length;
      this.formIndex = 0;
    } else {
      this.formsExist = false;
    }//End if
  }//End deleteTemplate

  selectTemplate(template) {
    this.template = template;
    this.detailCount(template);
    if (this.template.assessment.length > 0) {
      this.formsExist = true;
      this.form = this.template.assessment[0];
      this.max = this.template.assessment.length;
      this.formIndex = 0;
    } else {
      this.formsExist = false;
    }//End if
  }//End selectTemplate

  setInfo() {
    this.$cookies.put('templateId', this.template._id);
    this.$cookies.put('templateName', this.template.name);
  }//End setInfo

  detailCount(template) { 
    this.fCount = 0, this.qCount = 0;
    
    for (var i = 0; i < template.assessment.length; i++) {
      ++this.fCount;
      for (var j = 0; j < template.assessment[i].questions.length; j++) {
        ++this.qCount;
      }
    }
  }//End detailCount

  next() { 
    if (this.formIndex >= this.max - 1) {
      this.formIndex = 0;
    } else {
      this.formIndex++;
      this.form = this.template.assessment[this.formIndex];
      var pre = document.getElementById('preview');
      pre.scrollTop = 0;
    }
  }//End next

  prev() { 
    if (this.formIndex <= 0) {
      this.formIndex = this.max - 1;
    } else {
      this.formIndex--;
      this.form = this.template.assessment[this.formIndex];
      var pre = document.getElementById('preview');
      pre.scrollTop = 0;
    }
  }//End next

  checkMax() {
    if (this.formIndex >= this.max - 1) {
      return true;
    }   
    return false;
  }//End checkMax

  checkMin() {
    if (this.formIndex <= 0) {
      return true;
    }
    return false;
  }//End checkMin

  toggleModal() {
    angular.element(this.$document[0].querySelector('.modal-demo'));
    var templates = this.templates, userId = this.userId;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_add.html'),
      controller: AddTemplateController,
      controllerAs: 'addCtrl',
      resolve: {
        templates: function() {
          return templates;
        },
        userId: function() {
          return userId;
        }
      }
    })//End open
  }//End toggleModal
}//End BuilderComponent

export default angular.module('apiLocalApp.builder', [uiRouter])
  .config(routes)
  .component('builder', {
    template: require('./builder.html'),
    controller: BuilderComponent,
    controllerAs: 'builderCtrl'
  })
  .name;
