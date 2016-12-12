'user strict'
const angular = require('angular');

export default function StartCompareController($uibModalInstance, $cookies, $state, clients, client, sharedSelected, shared) {
  var $ctrl = this;
  $ctrl.$uibModalInstance = $uibModalInstance;
  $ctrl.$cookies = $cookies;
  $ctrl.$state = $state;
  $ctrl.clients = clients;
  $ctrl.clientCopy = client;
  $ctrl.panel = 1;
  $ctrl.newAssessment = null;
  $ctrl.sharedSelected = sharedSelected;
  $ctrl.selectionOne = client, $ctrl.selectionTwo = null;
  $ctrl.apiSelection = client, $ctrl.apiAssessment = null;
  if(sharedSelected == true) {
    $ctrl.selectionOne = shared.client;
    $ctrl.apiSelection = shared.client;
  }
  $ctrl.assessmentOne = null, $ctrl.assessmentTwo = null;
  $ctrl.countrySelected = 'none', $ctrl.industrySelected = 'none';
  $ctrl.iSelection = true, $ctrl.ind = true, $ctrl.filteredList = [];
  $ctrl.$cookies.put('sharedSelected', 'false');

  $ctrl.switch = function(n) {
    $ctrl.panel = n;
    
    if (n === 1){
      $ctrl.ind = true;
      $ctrl.api = false;
    }
    else if (n === 2) {
      $ctrl.api = true;
      $ctrl.ind = false;
    }
  }//End individual

  $ctrl.copyClientOne = function(client) {
    $ctrl.selectionOne = client;
  }//End copyTemplate

  $ctrl.copyClientTwo = function(client) {
    $ctrl.selectionTwo = client;
    $ctrl.filterList();
  }//End copyTemplate

  $ctrl.changeAssessmentOne = function() {
    if ($ctrl.selectionTwo != undefined)
      $ctrl.filterList();
  }//End changeAssessmentOne

  $ctrl.copyApiClient = function(client) {
    $ctrl.apiSelection = client;
  }//End copyApiClient

  $ctrl.filterList = function() {
    $ctrl.filteredList = null;
    $ctrl.filteredList = [];
    for (var i = 0; i < $ctrl.selectionTwo.assessments.length; i++) {
      if ($ctrl.selectionTwo.assessments[i].tempName === $ctrl.assessmentOne.tempName)
        $ctrl.filteredList.push($ctrl.selectionTwo.assessments[i]);
    }

    if($ctrl.filteredList.length === 0)
      $ctrl.noMatches = true;
  }//End filterList

  $ctrl.checkTemplate = function(f, f2) {
    $ctrl.submitted = true;

    if (f.$valid || f2.valid) {
      if ($ctrl.ind) {
        if ($ctrl.sharedSelected == true) {
          $ctrl.$cookies.put('sharedUserId', shared.uid);
          $ctrl.$cookies.put('sharedSelected', 'true');
        }
        $ctrl.$cookies.put('clientId', $ctrl.selectionOne._id);
        $ctrl.$cookies.put('clientName', $ctrl.selectionOne.name);
        $ctrl.$cookies.put('assessmentId', $ctrl.assessmentOne._id);
        $ctrl.$cookies.put('assessmentName', $ctrl.assessmentOne.name);
        $ctrl.$cookies.put('clientId2', $ctrl.selectionTwo._id);
        $ctrl.$cookies.put('clientName2', $ctrl.selectionTwo.name);
        $ctrl.$cookies.put('assessmentId2', $ctrl.assessmentTwo._id);
        $ctrl.$cookies.put('assessmentName2', $ctrl.assessmentTwo.name);
        $ctrl.$uibModalInstance.close(); 
        $ctrl.$state.go('compare');
      }
      if ($ctrl.api) {
        if ($ctrl.sharedSelected == true) {
          $ctrl.$cookies.put('sharedUserId', shared.uid);
          $ctrl.$cookies.put('sharedSelected', 'true');
        }
        $ctrl.$cookies.put('clientId', $ctrl.apiSelection._id);
        $ctrl.$cookies.put('clientName', $ctrl.apiSelection.name);
        $ctrl.$cookies.put('assessmentId', $ctrl.apiAssessment._id);
        $ctrl.$cookies.put('assessmentName', $ctrl.apiAssessment.name);
        $ctrl.$cookies.put('countrySelected', $ctrl.countrySelected);
        $ctrl.$cookies.put('industrySelected', $ctrl.industrySelected);
        $ctrl.$uibModalInstance.close();
        $ctrl.$state.go('compareAll'); 
      }
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

StartCompareController.$inject = ['$uibModalInstance', '$cookies', '$state', 'clients', 'client', 'sharedSelected', 'shared'];