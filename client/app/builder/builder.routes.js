'use strict';

import FormEditorComponent from './form_editor/form_editor.component'
import QuestionEditorComponent from './question_editor/question_editor.component'
import PreviewComponent from './preview/preview.component'

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('builder', {
      url: '/builder',
      template: '<builder></builder>'
    })
    .state('formEditor', {
    	url: '/builder/form-editor',
    	template: require('./form_editor/form_editor.html'),
    	controller: FormEditorComponent,
    	controllerAs: 'editCtrl'
    })
    .state('questionEditor', {
      url: '/builder/question-editor',
      template: require('./question_editor/question_editor.html'),
      controller: QuestionEditorComponent,
      controllerAs: 'editCtrl'
    })
    .state('preview', {
      url: '/builder/preview',
      template: require('./preview/preview.html'),
      controller: PreviewComponent,
      controllerAs: 'preCtrl'
    });
}//End state function
