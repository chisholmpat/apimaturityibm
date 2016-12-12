'use strict';

import ResultComponent from './result/result.component'

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('assessment', {
      url: '/assessment',
      template: '<assessment></assessment>'
    })
    .state('result', {
      url: '/results',
      template: require('./result/result.html'),
      controller: ResultComponent,
      controllerAs: 'resCtrl'
    });
}
