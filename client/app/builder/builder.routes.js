'use strict';

import FormEditorComponent from './form_editor/form_editor.component'
import QuestionEditorComponent from './question_editor/question_editor.component'

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
    	controllerAs: 'editCtrl',
    	params: {
    		userId: null,
    		templateId: null,
        templateName: null
    	}
    })
    .state('questionEditor', {
      url: '/builder/question-editor',
      template: require('./question_editor/question_editor.html'),
      controller: QuestionEditorComponent,
      controllerAs: 'editCtrl',
      params: {
        userId: null,
        templateId: null,
        qTemplateName: null,
        formId: null,
        formName: null
      }
    });
}//End state function
