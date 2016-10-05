'use strict';
import NewAssessmentComponent from './new_assessment/new_assessment.component'
import HistoryComponent from './history/history.component'

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
      template: require('./history/history.html'),
      controller: HistoryComponent,
      controllerAs: 'asCtrl',
      params: {
        userId: null,
        clientId: null
      }//End params
    });
}