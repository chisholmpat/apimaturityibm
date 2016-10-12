'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

/**
 * User CRUD routes
 */
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

/**
 * Client CRUD routes
 */
router.get('/client/:id/:clientId', controller.showClient);
router.put('/clientUpdate/:id/:clientId', controller.upsertClient);
router.delete('/clientDelete/:id/:clientId', controller.destroyClient);
router.post('/clientNew/:id', controller.createClient);

/**
 * Assessment CRUD routes
 */
router.get('/assessment/:id/:clientId', controller.showAssessments);
router.get('/assessment/:id/:clientId/:assessmentId', controller.showAssessment);
router.post('/assessmentNew/:id/:clientId', controller.createAssessment);
router.delete('/assessmentDelete/:id/:clientId/:assessmentId', controller.destroyAssessment);

/**
 * Assessment template CRUD routes
 */
router.get('/template/:id', controller.showTemplates);
router.get('/template/:id/:assessmentId', controller.showTemplate)
router.delete('/templateDelete/:id/:assessmentId', controller.destroyTemplate);
router.post('/templateNew/:id', controller.createTemplate);
router.get('/template/form/:id/:assessmentId', controller.showTemplateForms);
router.put('/template/formUpdate/:id/:assessmentId/:formId', controller.upsertForm);
router.delete('/template/formDelete/:id/:assessmentId/:formId', controller.destroyForm);
router.post('/template/formNew/:id/:assessmentId/', controller.createForm);
router.get('/template/question/:id/:assessmentId/:formId', controller.showFormQuestions);
router.put('/template/questionUpdate/:id/:assessmentId/:formId/:questionId', controller.upsertQuestion);
router.delete('/template/questionDelete/:id/:assessmentId/:formId/:questionId', controller.destroyQuestion);
router.post('/template/questionNew/:id/:assessmentId/:formId', controller.createQuestion);

module.exports = router;