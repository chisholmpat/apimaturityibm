import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

import NewAssessmentController from './modal_components/modal_assessment.controller';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, $cookies, Auth, socket, $uibModal, $document, scores, graph) {
    this.$http = $http;
    this.socket = socket;
    this.$cookies = $cookies;
    this.$uibModal = $uibModal;
    this.$document = $document;
    this.scores = scores;
    this.graph = graph;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.animationEnabled = true;
  }

  $onInit() {
    if (this.$cookies.get('token') !== undefined) {
      this.$http.get('/api/users/me')
      .then(response => {
        this.$cookies.put('userId', response.data._id);
        this.userId = this.$cookies.get('userId');
        this.$http.get('/api/users/compare/' + 'API-Maturity Template')
        .then(response => {
          var dataObj = response.data;
          this.results = this.scores.allAverages(dataObj);
          this.graph.paintRadarGraph(this.results, 'globalScores');
          this.$http.get('/api/users/recentActivity/' + this.userId)
          .then(response => {
            this.dataObj = response.data;
            this.graph.paintActivityGraph(this.dataObj, 'activityGraph');
            this.dataLoaded = true;
          })
        })
      })
    }
  }//End onInit
}//End controller

export default angular.module('apiLocalApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: 'mainCtrl'
  })
  .name;
