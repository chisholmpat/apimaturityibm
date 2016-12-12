'use strict';

import angular from 'angular';

export default class ResetController {

  /*@ngInject*/
  constructor(Auth, $http, $state, $stateParams) {
    this.Auth = Auth;
    console.log(this.user);
    this.$http = $http;
    this.$state = $state;
    this.token = $stateParams.token;
    console.log(this.token);
    this.changed = false, this.didntChange = false;
  }

  $onInit() {
    this.$http.get('/api/users/getByToken/' + this.token)
    .then(response => {
      if (response.data === 'notUser') {
        alert('The token you provided is invalid, please try reseting the password again.');
        this.$state.go('forgot');
      } else {
        this.userCopy = response.data;
      }
    })
  }

  changePassword(f) {
    this.submitted = true;

    if (f.$valid) {
      this.$http.post('/api/users/setPasswordByToken/' + this.token + '/' + this.newPassword)
      .then(response => {
        this.$state.go('login');
      })
    } else {
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });
    }
  }//End sendToken
}
