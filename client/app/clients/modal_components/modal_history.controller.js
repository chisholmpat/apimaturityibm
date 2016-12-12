'user strict'

export default function ClientHistoryController($uibModalInstance, $cookies, $state, client, sharedSelected, sharedUserId) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$cookies = $cookies;
  $ctrl.$state = $state;
  $ctrl.client = client;
  $ctrl.sharedSelected = sharedSelected;
  if(sharedSelected == true)
    $ctrl.sharedUserId = sharedUserId;
  $ctrl.assessment = null;
  $ctrl.$cookies.put('sharedSelected', 'false');

  $ctrl.view = function(assessment) {
    if (sharedSelected) {
      $ctrl.$cookies.put('sharedUserId', $ctrl.sharedUserId);
      $ctrl.$cookies.put('sharedSelected', 'true');
    }

    $ctrl.$cookies.put('assessmentId', assessment._id);
    $ctrl.$cookies.put('assessmentName', assessment.name);
    $ctrl.$cookies.put('clientId', client._id);
    $ctrl.$cookies.put('clientName', client.name);
    $ctrl.$uibModalInstance.close(); 
    $ctrl.$state.go('finishedAssessment');
  }//End view

  $ctrl.edit = function(assessment) {
    if (sharedSelected) {
      $ctrl.$cookies.put('sharedUserId', $ctrl.sharedUserId);
      $ctrl.$cookies.put('sharedSelected', 'true');
    }
    
    $ctrl.$cookies.put('assessmentId', assessment._id);
    $ctrl.$cookies.put('assessmentName', assessment.name);
    $ctrl.$cookies.put('clientId', client._id);
    $ctrl.$cookies.put('clientName', client.name);
    $ctrl.$uibModalInstance.close(); 
    $ctrl.$state.go('newAssessment')
  }

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

ClientHistoryController.$inject = ['$uibModalInstance', '$cookies', '$state', 'client', 'sharedSelected', 'sharedUserId'];