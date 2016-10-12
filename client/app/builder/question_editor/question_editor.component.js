'use strict';

export default class QuestionEditorComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, $cookies, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = this.$cookies.get('userId');
    this.templateId = this.$cookies.get('templateId');
    this.tempName = this.$cookies.get('templateName');
    this.formId = this.$cookies.get('formId');
    this.formName = this.$cookies.get('formName');
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/question/' + this.userId + '/' + this.templateId + '/' + this.formId)
    .then(response => {
      this.questions = response.data;
    })
  }//End onInit

  saveQuestion(question) {
    this.$http.post('/api/users/template/questionNew/' + this.userId + '/' + this.templateId +'/' + this.formId, question)
    .then(response => {
      this.questions = response.data;
      this.newQuestion = {};
    })
  }//End saveQuestion

  deleteQuestion(question) {
    this.$http.delete('/api/users/template/questionDelete/' + this.userId + '/' + this.templateId + '/' + this.formId + '/' + question._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.questions.splice(this.questions.indexOf(question), 1);
  }//End deleteQuestion

  updateQuestion(question) {
    this.$http.put('/api/users/template/questionUpdate/' + this.userId + '/' + this.templateId + '/' + this.formId + '/' + question._id, question)
    .success(function() {
      question.edit = false;
    })
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
  }//End updateForm

  toggleEdit(question) {
    question.edit = !question.edit;
  }//End toggleEdit
} //End AssessmentsComponent