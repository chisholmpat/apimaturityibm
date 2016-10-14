'user strict'

export default function AddFormController($uibModalInstance, $http, userId, templateId, forms) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.templateId = templateId;
  $ctrl.forms = forms;
  $ctrl.newForm = null;

  $ctrl.submit = function () {
    $ctrl.$http.post('/api/users/template/formNew/' + $ctrl.userId + '/' + $ctrl.templateId, $ctrl.newForm)
    .then(response => {
      $ctrl.forms.push(response.data[response.data.length - 1]);
      $ctrl.$uibModalInstance.close();
    });
  };

  $ctrl.cancel = function () {
    $ctrl.$uibModalInstance.dismiss('cancel');
  };
}//End modalController

AddFormController.$inject = ['$uibModalInstance', '$http', 'userId', 'templateId', 'forms'];