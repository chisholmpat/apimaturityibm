'use strict';

import angular from 'angular';

export default class ForgotController {

  /*@ngInject*/
  constructor(Auth, $http, $state) {
    this.Auth = Auth;
    this.$http = $http;
    this.$state = $state;
    this.email = '';
    this.sent = false, this.didntSend = false;
  }

  sendToken(f) {
    this.submitted = true;

    if (f.$valid) {
      this.$http.post('/api/users/forgotPassword/' + this.email)
      .then(response => {
        if (response.data === 'sent') {
          this.sent = true;
        } else if (response.data === 'didntSend') {
          this.didntSend = true
        } else if (response.data ==='notUser') {
          this.notUser = true;
        }
      })
    } else {
      angular.forEach(f.$error.required, function(field) {
        field.$setTouched();
      });
    }
  }//End sendToken
}
