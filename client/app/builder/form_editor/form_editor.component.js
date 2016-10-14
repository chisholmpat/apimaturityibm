'use strict';
import AddFormController from './modal_components/modal_add_form.controller'

export default class FormEditorComponent {
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
    this.templateId = this.$cookies.get('templateId');
    this.templateName = this.$cookies.get('templateName');
    this.forms = null;
    this.animationEnabled = true;
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/form/' + this.userId + '/' + this.templateId)
    .then(response => {
      this.forms = response.data;
    })
  }//End onInit

  deleteForm(form) {
    this.$http.delete('/api/users/template/formDelete/' + this.userId + '/' + this.templateId + '/' + form._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.forms.splice(this.forms.indexOf(form), 1);
  }//End deleteForm

  updateForm(form) {
    this.$http.put('/api/users/template/formUpdate/' + this.userId + '/' + this.templateId + '/' + form._id, form)
    .success(function() {
      form.edit = false;
    })
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
  }//End updateForm

  toggleEdit(form) {
    form.edit = !form.edit;
  }//End toggleEdit

  setInfo(form) {
    this.$cookies.put('formId', form._id);
    this.$cookies.put('formName', form.name);
  }//End setInfo

  questionCount(form) {
    this.count = 0;

    for (var i = 0; i < form.questions.length; i++) {
      ++this.count;
    }

    return this.count;
  }//End questionCount

  toggleModal() {
    var forms = this.forms, userId = this.userId, templateId = this.templateId;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_add_form.html'),
      controller: AddFormController,
      controllerAs: 'addCtrl',
      resolve: {
        forms: function() {
          return forms;
        },
        userId: function() {
          return userId;
        },
        templateId: function() {
          return templateId;
        }
      }
    })//End open
  }//End toggleModal
} //End AssessmentsComponent