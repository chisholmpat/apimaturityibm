'user strict'

export default function AddClientController($uibModalInstance, $http, userId, clients) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.clients = clients;
  $ctrl.newClient = null;
  $ctrl.num = 1;
  $ctrl.alertTrigger = false;

  $ctrl.select = function(n) {
    $ctrl.num = n;
  };//End select

  $ctrl.isSelected = function(n) {
    return $ctrl.num == n;
  };//End isSelected

  $ctrl.closeAlert = function(index) {
    $ctrl.alerts.splice(index, 1);
  };//End closeAlert

  $ctrl.checkForm = function(fOne, fTwo) {
    if (fOne.$valid && fTwo.$valid) {
      $ctrl.$http.post('/api/users/clientNew/' + $ctrl.userId, $ctrl.newClient)
      .then(response => {
        $ctrl.clients.push(response.data[response.data.length - 1]);
        $ctrl.$uibModalInstance.close(); 
      });
    } else {
      $ctrl.alertTrigger = true;
      $ctrl.alerts = [
        { type: 'danger', msg: 'This request cannot be processed. Please review the client details.' }
      ];
      angular.forEach(fOne.$error.required, function(field) {
        field.$setTouched();
      });
      angular.forEach(fTwo.$error.required, function(field) {
        field.$setTouched();
      });     
    }
  }//End checkForm

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };//End cancel
}//End modalController

AddClientController.$inject = ['$uibModalInstance', '$http', 'userId', 'clients'];