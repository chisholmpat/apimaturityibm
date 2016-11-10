'user strict'

import angular from 'angular';

export default function ClientDetailsController($uibModalInstance, $http, $cookies, clientCopy, userId) {
  var $ctrl = this;
  $ctrl.$http = $http;
  $ctrl.$cookies = $cookies;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.userId = userId;
  $ctrl.client = clientCopy;
  $ctrl.editCopy = null;
  $ctrl.edit = false;
  $ctrl.submitted = false;

  $ctrl.toggleEdit = function(client) {
    $ctrl.edit = !$ctrl.edit;
    $ctrl.editCopy = angular.copy(client);
  }//End toggleEdit

  $ctrl.cancelEdit = function(client) {
    $ctrl.client = angular.copy($ctrl.editCopy);
    $ctrl.edit = !$ctrl.edit;
    $ctrl.submitted = false;
  }//End cancelEdit

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$http.put('/api/users/clientUpdate/' + $ctrl.userId + '/' + $ctrl.client._id, $ctrl.client)
      .error(function(err) {
        $ctrl.$uibModalInstance.close();
        alert('An error occured while saving your changes. Please try again.');
      });
      $ctrl.$uibModalInstance.close();
    } else {
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });    
    }//End if
  }//End checkForm

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

ClientDetailsController.$inject = ['$uibModalInstance', '$http', '$cookies', 'clientCopy', 'userId'];