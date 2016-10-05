'use strict';

export default function routes($stateProvider) {
  'ngInject';
  
  $stateProvider.state('clients', {
      url: '/clients',
      template: '<clients></clients>'
    })
    .state('newAssessment', {
    	url: '/clients/new-assessment/',
    	template: require('./new_assessment/new_assessment.html'),
    	controller: NewAssessmentComponent,
      controllerAs: 'nasCtrl',
      params: {
        userId: null,
        clientId: null
      }//End params
    })
    .state('viewAssessments', {
      url: '/clients/assessment-history',
      template: require('./clients.viewAssessments.html'),
      controller: AssessmentsComponent,
      controllerAs: 'asCtrl',
      params: {
        userId: null,
        clientId: null
      }//End params
    });
}

class AssessmentsComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.userId = $scope.$resolve.$stateParams.userId;
    this.clientId = $scope.$resolve.$stateParams.clientId;
    this.assessments = {};
  }//End constructor

  $onInit() {      
    this.$http.get('/api/users/client/' + this.userId + '/' + this.clientId).then(response => {
      this.client = response.data;
      this.assessments = this.client.assessments;
    })
  }//End onInit

  deleteAssessment(assessment) {

  }//End deleteAssessment
} //End AssessmentsComponent

class NewAssessmentComponent {
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
    this.$http.post('/api/users/assessmentNew/' + this.userId + '/' + this.clientId, this.newAssessment);
    //Redirect code goes here
  }//End saveAssessment 
}//End newAssessmentComponent






