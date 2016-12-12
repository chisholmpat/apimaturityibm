'use strict';

import ForgotController from './forgot/forgot.controller'
import ResetController from './reset/reset.controller'

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('logout', {
    url: '/logout?referrer',
    referrer: 'main',
    template: '',
    controller($state, Auth) {
      'ngInject';

      var referrer = $state.params.referrer || $state.current.referrer || 'main';
      Auth.logout();
      $state.go(referrer);
    }
  })
  .state('signup', {
    url: '/signup',
    template: require('./signup/signup.html'),
    controller: 'SignupController',
    controllerAs: 'vm'
  })
  .state('settings', {
    url: '/settings',
    template: require('./settings/settings.html'),
    controller: 'SettingsController',
    controllerAs: 'vm',
    authenticate: true
  })
  .state('forgot', {
    url: '/forgot',
    template: require('./forgot/forgot.html'),
    controller: ForgotController,
    controllerAs: 'forCtrl'
  })
  .state('reset', {
    url: '/reset/:token',
    template: require('./reset/reset.html'),
    controller: ResetController,
    controllerAs: 'resCtrl'
  });
}
