'user strict'
const angular = require('angular');

export default function ShareClientController($uibModalInstance, $http, Auth, $cookies, clientCopy) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.Auth = Auth;
  $ctrl.$cookies = $cookies;
  $ctrl.userId = $ctrl.$cookies.get('userId');
  $ctrl.clientCopy = clientCopy;
  $ctrl.email = '';

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;
    $ctrl.sameEmail = false, $ctrl.shared = false;

    if (f.$valid) {
      $ctrl.$http.post('/api/users/clientAccess/' + this.userId + '/' + $ctrl.email + '/' + $ctrl.clientCopy._id)
      .then(response => {
        if (response.data === 'shared') {
          $ctrl.shared = true;
        } else if (response.data === 'sameEmail') {
          $ctrl.sameEmail = true
        } else if (response.data === 'notFound') {
          $ctrl.notFound = true;
        } else {
          $ctrl.$uibModalInstance.close();
        }
      })
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

ShareClientController.$inject = ['$uibModalInstance', '$http', 'Auth', '$cookies', 'clientCopy'];