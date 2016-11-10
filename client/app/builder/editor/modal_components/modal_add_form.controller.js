'user strict'

export default function AddFormController($uibModalInstance, $http, userId, templateId, forms) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.templateId = templateId;
  $ctrl.forms = forms;
  $ctrl.newForm = null;
  $ctrl.submitted = false;

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$http.post('/api/users/template/formNew/' + $ctrl.userId + '/' + $ctrl.templateId, $ctrl.newForm)
      .then(response => {
        $ctrl.forms.push(response.data[response.data.length - 1]);
        $ctrl.$uibModalInstance.close();
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
  };
}//End modalController

AddFormController.$inject = ['$uibModalInstance', '$http', 'userId', 'templateId', 'forms'];