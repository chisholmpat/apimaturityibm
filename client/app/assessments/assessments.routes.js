'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('assessments', {
      url: '/assessments',
      template: '<assessments></assessments>'
    });
}
