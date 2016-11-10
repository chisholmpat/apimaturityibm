'user strict'

export default function ClientHistoryController($uibModalInstance, $cookies, $state, client) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$cookies = $cookies;
  $ctrl.$state = $state;
  $ctrl.client = client;
  $ctrl.assessment = null;

  $ctrl.view = function(assessment) {
    $ctrl.$cookies.put('assessmentId', assessment._id);
    $ctrl.$cookies.put('clientId', client._id);
    $ctrl.$cookies.put('clientName', client.name);
    $ctrl.$cookies.put('assessmentName', assessment.name);
    $ctrl.$uibModalInstance.close(); 
    $ctrl.$state.go('finishedAssessment');
  }//End view

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

ClientHistoryController.$inject = ['$uibModalInstance', '$cookies', '$state', 'client'];