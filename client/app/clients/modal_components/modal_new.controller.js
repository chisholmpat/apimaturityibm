'user strict'
const angular = require('angular');

export default function NewAssessmentController($uibModalInstance, $http, Auth, $cookies, $state, client, templates, sharedSelected, sharedUserId) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.Auth = Auth;
  $ctrl.$cookies = $cookies;
  $ctrl.$state = $state;
  $ctrl.getCurrentUser = Auth.getCurrentUserSync;
  $ctrl.userId = $ctrl.$cookies.get('userId');
  $ctrl.$cookies.put('sharedSelected', 'false');
  $ctrl.sharedSelected = sharedSelected;
  if(sharedSelected == true) {
    $ctrl.sharedUserId = sharedUserId;
    $ctrl.userId = sharedUserId;
    $ctrl.$cookies.put('sharedSelected', 'true');
  }
  $ctrl.client = client;
  $ctrl.templates = templates;
  $ctrl.newAssessment = null;
  $ctrl.date = Date.now();
  $ctrl.selection = null;
  $ctrl.copy = null;
  $ctrl.assessmentName = '';
  $ctrl.showDesc = false;

  $ctrl.copyTemplate = function(template) {
    $ctrl.copy = template;
    $ctrl.showDesc = true;
  }//End copyTemplate

  $ctrl.checkTemplate = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.savingData = true;
      $ctrl.newAssessment = angular.copy($ctrl.copy);
      $ctrl.newAssessment.tempName = $ctrl.newAssessment.name;
      $ctrl.newAssessment.name = $ctrl.assessmentName;
      delete $ctrl.newAssessment._id;

      $ctrl.newAssessment.assessment.forEach(function(f) {
        delete f._id;

        f.questions.forEach(function(q) {
          delete q._id;
        });
      })//End forEach

      $ctrl.$http.post('/api/users/assessmentNew/' + $ctrl.userId + '/' + $ctrl.client._id, $ctrl.newAssessment)
      .then(response => {
        $ctrl.$cookies.put('clientId', $ctrl.client._id);
        $ctrl.$cookies.put('clientName', $ctrl.client.name);
        $ctrl.$cookies.put('assessmentId', response.data._id);
        $ctrl.$cookies.put('assessmentName', response.data.name);
        $ctrl.$uibModalInstance.close();
        $ctrl.$state.go('newAssessment')
      });
    } else {
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });
    }
  }//End checkTemplate

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

NewAssessmentController.$inject = ['$uibModalInstance', '$http', 'Auth', '$cookies', '$state', 'client', 'templates', 'sharedSelected', 'sharedUserId'];