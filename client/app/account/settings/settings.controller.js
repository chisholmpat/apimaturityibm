'use strict';

export default class SettingsController {
  $http;

  /*@ngInject*/
  constructor(Auth, $http) {
    this.Auth = Auth;
    this.$http = $http;
    this.pwSubmit = false;
  }

  $onInit() {
    this.$http.get('/api/users/me')
    .then(response => {
      this.userCopy = response.data;
    })
  }

  changePassword(form) {
    this.submitted = true;

    if (this.pwErr){
        form.password.$setValidity('mongoose', true);
    }
    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          this.message = '';
          this.other = 'Incorrect password.';
          this.pwErr = true;
          this.pwSubmit = true;
          form.password.$setValidity('mongoose', false);
      });
    }
  }
}//End controller
