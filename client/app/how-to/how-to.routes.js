'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('how-to', {
      url: '/how-to',
      template: '<how-to></how-to>'
    });
}
