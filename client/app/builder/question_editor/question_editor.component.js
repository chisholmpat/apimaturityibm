'use strict';
import AddQuestionController from './modal_components/modal_add_question.controller'

export default class QuestionEditorComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, $cookies, $uibModal, $document, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.userId = this.$cookies.get('userId');
    this.templateId = this.$cookies.get('templateId');
    this.tempName = this.$cookies.get('templateName');
    this.formId = this.$cookies.get('formId');
    this.formName = this.$cookies.get('formName');
    this.questions = null;
    this.animationEnabled = true;
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/question/' + this.userId + '/' + this.templateId + '/' + this.formId)
    .then(response => {
      this.questions = response.data;
    })
  }//End onInit

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

  toggleModal() {
    var questions = this.questions, userId = this.userId, templateId = this.templateId,
      formId = this.formId;

    var modalInstance = this.$uibModal.open({
      animation: this.animationEnabled, 
      ariaLabelledBy: 'modal-title',
      template: require('./modal_components/modal_add_question.html'),
      controller: AddQuestionController,
      controllerAs: 'addCtrl',
      resolve: {
        questions: function() {
          return questions;
        },
        userId: function() {
          return userId;
        },
        templateId: function() {
          return templateId;
        },
        formId: function() {
          return formId;
        }
      }
    })//End open
  }//End toggleModal
} //End AssessmentsComponent