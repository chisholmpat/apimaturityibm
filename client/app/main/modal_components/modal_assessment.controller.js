'user strict'

export default function NewAssessmentController($uibModalInstance, $state, $cookies, clients, templates, userId) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$state = $state;
  $ctrl.$cookies = $cookies;
  $ctrl.clients = clients;
  $ctrl.templates = templates;
  $ctrl.userId = userId;
  $ctrl.submitted = false;
  $ctrl.date = Date.now();
  $ctrl.selection = null;
  $ctrl.copy = null;
  $ctrl.clientCopy = null;
  $ctrl.templateId = null;
  $ctrl.assessmentName = '';
  $ctrl.showDesc = false;

  $ctrl.copyTemplate = function(template) {
    $ctrl.copy = template;
    $ctrl.showDesc = true;
  }//End copyTemplate

  $ctrl.copyClient = function(client) {
    $ctrl.clientCopy = client;
  }

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$cookies.put('templateId', $ctrl.copy._id);
      $ctrl.$cookies.put('newAssessmentName', $ctrl.assessmentName);
      $ctrl.$cookies.put('clientId', $ctrl.clientCopy._id);
      $ctrl.$cookies.put('clientName', $ctrl.clientCopy.name);
      $ctrl.$uibModalInstance.close(); 
      $ctrl.$state.go('newAssessment')
    } else {
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });
    }
  }//End checkTemplate

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };
}//End modalController

NewAssessmentController.$inject = ['$uibModalInstance', '$state', '$cookies', 'clients', 'templates', 'userId'];