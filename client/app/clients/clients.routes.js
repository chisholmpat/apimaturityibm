'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('clients', {
      url: '/clients',
      template: '<clients></clients>'
    });
}
