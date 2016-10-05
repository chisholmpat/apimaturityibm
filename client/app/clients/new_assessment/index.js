'use strict';

import angular from 'angular';
import NewAssessmentComponent from './new_assessment.component';

export default angular.module('apiLocalApp.NewAssessment', [])
  .controller('NewAssessmentComponent', NewAssessmentComponent)
  .name;