'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import ngMessages from 'angular-messages';
// import ngMaterial from 'angular-material';
// import ngAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import smartTable from 'angular-smart-table';
import 'chart.js';
// import ngValidationMatch from 'angular-validation-match';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import how_to from './how-to/how-to.component';
import builder from './builder/builder.component';
import clients from './clients/clients.component';
import assessment from './assessment/assessment.component';
import graph from './graph/graph.service';
import scores from './scores/scores.service';
import pdf from './pdf/pdf.service';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import './app.scss';

angular.module('apiLocalApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter,
    uiBootstrap, ngMessages, ngAnimate, smartTable, _Auth, account, admin, navbar, footer, main, constants, 
    socket, util, clients, builder, assessment, how_to, graph, scores, pdf
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['apiLocalApp'], {
      strictDi: true
    });
  });
