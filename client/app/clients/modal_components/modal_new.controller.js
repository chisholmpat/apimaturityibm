'user strict'

export default function NewAssessmentController($uibModalInstance, $http, Auth, $cookies, $state, client, templates) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.Auth = Auth;
  $ctrl.$cookies = $cookies;
  $ctrl.$state = $state;
  $ctrl.getCurrentUser = Auth.getCurrentUserSync;
  $ctrl.client = client;
  $ctrl.templates = templates;
  $ctrl.date = Date.now();
  $ctrl.selection = null;
  $ctrl.copy = null;
  $ctrl.templateId = null;
  $ctrl.assessmentName = '';
  $ctrl.alertTrigger = false;
  $ctrl.showDesc = false;

  $ctrl.copyTemplate = function(template) {
    $ctrl.copy = template;
    $ctrl.showDesc = true;
    $ctrl.detailCount();
  }//End copyTemplate

  $ctrl.detailCount = function() {
    $ctrl.fCount = 0, $ctrl.qCount = 0;

    for (var i = 0; i < $ctrl.copy.assessment.length; i++) {
      ++$ctrl.fCount;
      for (var j = 0; j < $ctrl.copy.assessment[i].questions.length; j++) {
        ++$ctrl.qCount;
      }
    }
  }//End detailCount

  $ctrl.checkTemplate = function(f) {
    if (f.$valid) {
      $ctrl.$cookies.put('templateId', $ctrl.selection);
      $ctrl.$cookies.put('newAssessmentName', $ctrl.assessmentName);
      $ctrl.$uibModalInstance.close(); 
      $ctrl.$state.go('newAssessment')
    } else {
      $ctrl.alerts = [
      { type: 'danger', msg: 'Please review the assessment details.' }
      ];
      $ctrl.alertTrigger = true;
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });
    }
  }//End checkTemplate

  $ctrl.closeAlert = function(index) {
    $ctrl.alerts.splice(index, 1);
  };//End closeAlert

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

NewAssessmentController.$inject = ['$uibModalInstance', '$http', 'Auth', '$cookies', '$state', 'client', 'templates'];