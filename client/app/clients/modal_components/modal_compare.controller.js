'user strict'
const angular = require('angular');

export default function StartCompareController($uibModalInstance, $http, Auth, $cookies, $state, clients) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.Auth = Auth;
  $ctrl.$cookies = $cookies;
  $ctrl.$state = $state;
  $ctrl.getCurrentUser = Auth.getCurrentUserSync;
  $ctrl.userId = $ctrl.$cookies.get('userId');
  $ctrl.clients = clients;
  $ctrl.newAssessment = null;
  $ctrl.date = Date.now();
  $ctrl.selection = null;
  $ctrl.copy = null;
  $ctrl.assessmentName = '';
  $ctrl.showDesc = false;

  $ctrl.copyClientOne = function(client) {
    // $ctrl.copy = template;
    // $ctrl.showDesc = true;
    console.log(client);
  }//End copyTemplate

  $ctrl.checkTemplate = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.savingData = true;
      $ctrl.newAssessment = angular.copy($ctrl.copy);
      $ctrl.newAssessment.name = $ctrl.assessmentName;

      $ctrl.$http.post('/api/users/assessmentNew/' + this.userId + '/' + $ctrl.client._id, $ctrl.newAssessment)
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

StartCompareController.$inject = ['$uibModalInstance', '$http', 'Auth', '$cookies', '$state', 'clients'];