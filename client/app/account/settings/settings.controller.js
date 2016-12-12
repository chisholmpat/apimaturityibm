'use strict';

export default class SettingsController {
  $http;

  /*@ngInject*/
  constructor(Auth, $http, $cookies, graph) {
    this.Auth = Auth;
    console.log(this.user);
    this.$http = $http;
    this.$cookies = $cookies;
    this.graph = graph;
    this.pwSubmit = false;
    this.userId = this.$cookies.get('userId');
  }

  $onInit() {
    this.$http.get('/api/users/me')
    .then(response => {
      this.userCopy = response.data;
      this.$http.get('/api/users/recentActivity/' + this.userCopy._id)
      .then(response => {
        this.dataObj = response.data;
        this.graph.paintActivityGraph(this.dataObj, 'activityGraph');
        this.dataLoaded = true;
      })
    })
  }

  togglePassword() {
    this.changeMyPassword = !this.changeMyPassword;
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
          this.changeMyPassword = !this.changeMyPassword;
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
