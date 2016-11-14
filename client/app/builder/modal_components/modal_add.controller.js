'user strict'

export default function AddTemplateController($uibModalInstance, $http, userId, templates) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$http = $http;
  $ctrl.userId = userId;
  $ctrl.templates = templates;
  $ctrl.selectedTemplate = null;
  $ctrl.selectedForms = [];
  $ctrl.formString = '';
  $ctrl.formsAdded = false;
  $ctrl.newTemplate = {
    name: '',
    description: '',
    assessment: []
  };
  $ctrl.submitted = false;

  $ctrl.copyTemplate = function(template) {
    $ctrl.selectedTemplate = template;
  }//End copyTemplate

  $ctrl.checkSelection = function() {
    if ($ctrl.selectedForms.length <= 0) {
      return true;
    }
    return false;
  }//End checkSelected

  $ctrl.confirmForms = function() {
    console.log($ctrl.selectedForms);
    var formsDeepCopied = [], parsedForms = [];

    for (var i = 0; i < $ctrl.selectedForms.length; i++) {
      formsDeepCopied[i] = angular.copy($ctrl.selectedForms[i]);
    }//End for

    formsDeepCopied.forEach(function(f) {
      if (!f.selected) {
        $ctrl.formString += f.name + ' (' + $ctrl.selectedTemplate.name + '), ';
        delete f._id;

        f.questions.forEach(function(q) {
          delete q._id;
        });

      $ctrl.newTemplate.assessment.push(f);
      }//End if
    });//End forEach

    for (var i = 0; i < $ctrl.selectedForms.length; i++)
      $ctrl.selectedForms[i].selected = true;

    $ctrl.formsAdded = true;
    console.log($ctrl.newTemplate);
  }//End confirmForms

  $ctrl.undoForms = function() {
    delete $ctrl.newTemplate.assessment;
    $ctrl.newTemplate.assessment = [];
    $ctrl.formString = '';
    $ctrl.formsAdded = false;
    $ctrl.selectedTemplate = null;
    var templateSelect = document.getElementById('templateSelect');
    templateSelect.selectedIndex = -1;
  }//End undoForms

  $ctrl.checkForm = function(f) {
    $ctrl.submitted = true;

    if (f.$valid) {
      $ctrl.$http.post('/api/users/templateNew/' + $ctrl.userId, $ctrl.newTemplate)
      .then(response => {
        $ctrl.templates.push(response.data[response.data.length - 1]);
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

AddTemplateController.$inject = ['$uibModalInstance', '$http', 'userId', 'templates'];