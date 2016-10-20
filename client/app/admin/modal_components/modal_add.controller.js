'user strict'

import angular from 'angular';

export default function AddUserController($uibModalInstance, $http, users) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.users = users;
  $ctrl.newUser = null;
  $ctrl.alertTrigger = false;

  $ctrl.closeAlert = function(index) {
    $ctrl.alerts.splice(index, 1);
  };//End closeAlert

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$http.post('/api/users/admin', $ctrl.newUser)
      .then(response => {
        $ctrl.users.push(response.data);
        $ctrl.$uibModalInstance.close();
      })
      .catch(err => {
        err = err.data;
        $ctrl.errors = {};
        $ctrl.alertTrigger = true;
        $ctrl.alerts = [
        { type: 'danger', msg: 'This request cannot be processed. Please review the client details.' }
        ];
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          f[field].$setValidity('mongoose', false);
          $ctrl.errors[field] = error.message;
        });
      });
    }//End if
  }//End checkForm

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

AddUserController.$inject = ['$uibModalInstance', '$http', 'users'];