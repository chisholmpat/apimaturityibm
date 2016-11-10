'use strict';

import EditorComponent from './editor/editor.component'

export default function($stateProvider) {
  'ngInject';
  
  $stateProvider
    .state('builder', {
      url: '/builder',
      template: '<builder></builder>',
      authenticate: true
    })
    .state('templateEditor', {
      url: '/builder/editor',
      template: require('./editor/editor.html'),
      controller: EditorComponent,
      controllerAs: 'editCtrl',
      authenticate: true
    });
}//End state function
