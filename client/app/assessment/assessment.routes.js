'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('assessment', {
      url: '/assessment',
      template: '<assessment></assessment>'
    });
}
