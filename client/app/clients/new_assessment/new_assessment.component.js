'use strict';

export default class NewAssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = $scope.$resolve.$stateParams.userId;
    this.clientId = $scope.$resolve.$stateParams.clientId;
    this.templates;
  }//End constructor

  $onInit() {
    this.newAssessment = {
      name: 'TestingSaves123',
      assessment: [{}]
    };
    
    this.$http.get('/api/users/me').then(response => {
      this.templates = response.data.assessmentTemplates;
      this.newAssessment.assessment = this.templates[0].assessment;
    })

    this.$http.get('/api/users/client/' + this.userId + '/' + this.clientId).then(response => {
      this.client = response.data;
    })
  }//End onInit

  saveAssessment() {
    this.$http.post('/api/users/assessmentNew/' + this.user._id + '/' + this.clientId, this.newAssessment);
    //Redirect code goes here
  }//End saveAssessment 
}//End newAssessmentComponent