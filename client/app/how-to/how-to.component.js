'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './how-to.routes';

export class HowToComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('apiLocalApp.how-to', [uiRouter])
  .config(routes)
  .component('howTo', {
    template: require('./how-to.html'),
    controller: HowToComponent,
    controllerAs: 'howToCtrl'
  })
  .name;
