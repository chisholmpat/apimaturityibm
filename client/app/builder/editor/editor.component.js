'use strict';
import AddFormController from './modal_components/modal_add_form.controller'
import AddQuestionController from './modal_components/modal_add_question.controller'

export default class EditorComponent {
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
    this.tempName = this.$cookies.get('templateName');
    this.template = null;
    this.form = null;
    this.animationEnabled = true;
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/' + this.userId + '/' + this.templateId)
    .then(response => {
      this.template = response.data;
      this.form = this.template.assessment[0];
      this.dataLoaded = true;
    })
  }//End onInit

  deleteForm(form) {
    this.$http.delete('/api/users/template/formDelete/' + this.userId + '/' + this.templateId + '/' + form._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.template.assessment.splice(this.template.assessment.indexOf(form), 1);
    this.form = this.template.assessment[0];
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

  deleteQuestion(question) {
    this.$http.delete('/api/users/template/questionDelete/' + this.userId + '/' + this.templateId + '/' + this.form._id + '/' + question._id)
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
    this.form.questions.splice(this.form.questions.indexOf(question), 1);
    this.question = this.form.questions[0];
  }//End deleteQuestion

  updateQuestion(question) {
    this.$http.put('/api/users/template/questionUpdate/' + this.userId + '/' + this.templateId + '/' + this.form._id + '/' + question._id, question)
    .success(function() {
      question.edit = false;
    })
    .error(function(err) {
      alert('An error occured while deleting. Please try again.');
    });
  }//End updateForm

  selectForm(form) {
    this.form = form;
  }

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

  incWeight(q) {
    if (q.weight <= 2)
      ++q.weight;
  }//End incWeight

  decWeight(q) {
    if (q.weight >= 1)
      --q.weight;
  }//End decWeight

  toggleFormModal() {
    var forms = this.template.assessment, userId = this.userId, templateId = this.templateId;

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

  toggleQuestionModal() {
    var questions = this.form.questions, userId = this.userId, templateId = this.templateId,
      formId = this.form._id;

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