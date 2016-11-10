'use strict';

import NewAssessmentComponent from './new_assessment/new_assessment.component'

import ViewAssessmentComponent from './assessment/assessment.component'

export default function routes($stateProvider) {
  'ngInject';
  
  $stateProvider.state('clients', {
      url: '/clients',
      template: '<clients></clients>',
      authenticate: true
    })
    .state('newAssessment', {
    	url: '/clients/new-assessment/',
    	template: require('./new_assessment/new_assessment.html'),
    	controller: NewAssessmentComponent,
      controllerAs: 'nasCtrl',
      authenticate: true
    })
    .state('finishedAssessment', {
      url: '/clients/assessment',
      template: require('./assessment/assessment.html'),
      controller: ViewAssessmentComponent,
      controllerAs: 'vasCtrl',
      authenticate: true
    });//End state declarations
}//End routes