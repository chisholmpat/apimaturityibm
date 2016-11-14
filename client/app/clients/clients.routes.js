'use strict';

import NewAssessmentComponent from './new_assessment/new_assessment.component'

import ViewAssessmentComponent from './assessment/assessment.component'

import CompareToolComponent from './compare/compare.component'

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
    })
    .state('compare', {
      url: '/clients/compare',
      template: require('./compare/compare.html'),
      controller: CompareToolComponent,
      controllerAs: 'comCtrl',
      authenticate: true
    });//End state declarations
}//End routes