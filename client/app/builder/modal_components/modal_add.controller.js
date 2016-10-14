'user strict'

export default function AddTemplateController($uibModalInstance, $http, userId, templates) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.templates = templates;
  $ctrl.newTemplate = null;

  $ctrl.submit = function () {
    $ctrl.$http.post('/api/users/templateNew/' + $ctrl.userId, $ctrl.newTemplate)
    .then(response => {
      $ctrl.templates.push(response.data[response.data.length - 1]);
      $ctrl.$uibModalInstance.close();
    });
  };

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };
}//End modalController

AddTemplateController.$inject = ['$uibModalInstance', '$http', 'userId', 'templates'];