'use strict';

export default class SelectAssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, socket, $state, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.$state = $state;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = this.$cookies.get('userId');
    this.clientId = this.$cookies.get('clientId');
    this.clientName = this.$cookies.get('clientName');
    this.date = Date.now();
    this.selection = null;
    this.copy = null;
    this.templateId = null;
    this.assessmentName = '';
    this.alertTrigger = false;
  }//End constructor

  $onInit() {     
    this.$http.get('/api/users/template/' + this.userId)
    .then(response => {
      this.templates = response.data;
    })
  }//End onInit

  copyTemplate(template) {
    this.copy = template;
    this.detailCount();
  }//End copyTemplate

  detailCount() {
    this.fCount = 0, this.qCount = 0;

    for (var i = 0; i < this.copy.assessment.length; i++) {
      ++this.fCount;
      for (var j = 0; j < this.copy.assessment[i].questions.length; j++) {
        ++this.qCount;
      }
    }
  }//End detailCount

  checkTemplate(f) {
    if (f.$valid) {
      this.$cookies.put('templateId', this.selection);
      this.$cookies.put('newAssessmentName', this.assessmentName);
      this.$state.go('newAssessment')
    } else {
      this.alerts = [
      { type: 'danger', msg: 'Please review the assessment details.' }
      ];
      this.alertTrigger = true;
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });
    }
  }//End checkTemplate

  closeAlert(index) {
    this.alerts.splice(index, 1);
  };//End closeAlert
} //End SelectAssessmentComponent