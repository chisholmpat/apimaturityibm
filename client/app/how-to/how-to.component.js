'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './how-to.routes';

export class HowToComponent {
  /*@ngInject*/
  constructor() {
    
  }

  scrollTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }//End scrollTop
}

export default angular.module('apiLocalApp.how-to', [uiRouter])
  .config(routes)
  .component('howTo', {
    template: require('./how-to.html'),
    controller: HowToComponent,
    controllerAs: 'howCtrl'
  })
  .name;
