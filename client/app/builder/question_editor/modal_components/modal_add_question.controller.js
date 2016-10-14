'user strict'

export default function AddQuestionController($uibModalInstance, $http, userId, templateId, formId, questions) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.templateId = templateId;
  $ctrl.formId = formId;
  $ctrl.questions = questions;
  $ctrl.newQuestion = null;

  $ctrl.submit = function () {
    $ctrl.$http.post('/api/users/client/clientNew/' + $ctrl.userId, $ctrl.newClient)
    .then(response => {
      $ctrl.clients.push(response.data[response.data.length - 1]);
      $ctrl.$uibModalInstance.close();
    });
  };

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };
}//End modalController

AddQuestionController.$inject = ['$uibModalInstance', '$http', 'userId', 'templateId', 'formId', 'questions'];