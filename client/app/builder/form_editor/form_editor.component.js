'use strict';

export default class FormEditorComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = $scope.$resolve.$stateParams.userId;
    this.templateId = $scope.$resolve.$stateParams.templateId;
    this.templateName = $scope.$resolve.$stateParams.templateName;
    this.forms = {};
    this.newform = {};
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/form/' + this.userId + '/' + this.templateId)
    .then(response => {
      this.forms = response.data;
    })
  }//End onInit

  saveForm(form) {
    this.$http.post('/api/users/template/formNew/' + this.userId + '/' + this.templateId, form)
    .then(response => {
      this.forms = response.data;
      this.newForm = {};
    })
  }//End saveForm

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

  questionCount(form) {
    this.count = 0;

    for (var i = 0; i < form.questions.length; i++) {
      ++this.count;
    }

    return this.count;
  }//End questionCount
} //End AssessmentsComponent