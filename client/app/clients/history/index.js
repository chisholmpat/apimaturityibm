'use strict';

import angular from 'angular';
import HistoryComponent from './history.component';

export default angular.module('apiLocalApp.history', [])
  .controller('HistoryComponent', HistoryComponent)
  .name;