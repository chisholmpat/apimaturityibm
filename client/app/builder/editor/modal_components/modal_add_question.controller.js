'user strict'

export default function AddQuestionController($uibModalInstance, $http, userId, templateId, formId, questions) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.templateId = templateId;
  $ctrl.formId = formId;
  $ctrl.questions = questions;
  $ctrl.newQuestion = {};
  $ctrl.newQuestion.weight = 0;
  $ctrl.submitted = false;

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$http.post('/api/users/template/questionNew/' + $ctrl.userId + '/' + $ctrl.templateId + '/' + $ctrl.formId, $ctrl.newQuestion)
      .then(response => {
        $ctrl.questions.push(response.data[response.data.length - 1]);
        $ctrl.$uibModalInstance.close();
      })
      .catch(err => {
        err = err.data;
        $ctrl.errors = {};
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          f[field].$setValidity('mongoose', false);
          $ctrl.errors[field] = error.message;
        });
      });
    }//End if
  }//End checkForm

  $ctrl.incWeight = function() {
    if ($ctrl.newQuestion.weight <= 2)
      ++$ctrl.newQuestion.weight;
  }//End incWeight

  $ctrl.decWeight = function() {
    if ($ctrl.newQuestion.weight >= 1)
      --$ctrl.newQuestion.weight;
  }//End decWeight

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };
}//End modalController

AddQuestionController.$inject = ['$uibModalInstance', '$http', 'userId', 'templateId', 'formId', 'questions'];