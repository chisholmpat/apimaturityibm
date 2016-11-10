'user strict'

export default function AddClientController($uibModalInstance, $http, userId, clients) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.clients = clients;
  $ctrl.newClient = null;
  $ctrl.saved = true;
  $ctrl.num = 1;

  $ctrl.select = function(n) {
    $ctrl.num = n;
  };//End select

  $ctrl.isSelected = function(n) {
    return $ctrl.num == n;
  };//End isSelected

  $ctrl.closeAlert = function(index) {
    $ctrl.alerts.splice(index, 1);
  };//End closeAlert

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$http.post('/api/users/clientNew/' + $ctrl.userId, $ctrl.newClient)
      .then(response => {
        $ctrl.clients.push(response.data[response.data.length - 1]);
        $ctrl.$uibModalInstance.close($ctrl.saved); 
      })
      .catch(err => {
        err = err.data;
        $ctrl.errors = {};
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

AddClientController.$inject = ['$uibModalInstance', '$http', 'userId', 'clients'];