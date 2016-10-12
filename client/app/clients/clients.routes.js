'use strict';
import NewAssessmentComponent from './new_assessment/new_assessment.component'
import HistoryComponent from './history/history.component'
import ViewAssessmentComponent from './assessment/assessment.component'
import SelectAssessmentComponent from './select_assessment/select_assessment.component'

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
      controllerAs: 'nasCtrl'
    })
    .state('assessmentHistory', {
      url: '/clients/assessment-history',
      template: require('./history/history.html'),
      controller: HistoryComponent,
      controllerAs: 'asCtrl'
    })
    .state('finishedAssessment', {
      url: '/clients/assessment',
      template: require('./assessment/assessment.html'),
      controller: ViewAssessmentComponent,
      controllerAs: 'vasCtrl'
    })
    .state('selectAssessment', {
      url: '/clients/select-assessment',
      template: require('./select_assessment/select_assessment.html'),
      controller: SelectAssessmentComponent,
      controllerAs: 'selCtrl'
    });//End state declarations
}//End routes