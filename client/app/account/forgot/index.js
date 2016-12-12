'use strict';

import angular from 'angular';
import ForgotController from './forgot.controller';

export default angular.module('apiLocalApp.forgot', [])
  .controller('ForgotController', ForgotController)
  .name;
