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
router.post('/admin', controller.adminCreate);
router.put('/admin/:id', controller.adminUpdate);
router.get('/recentActivity/:id', controller.recentActivity);
router.put('/setActive/:id', auth.hasRole('admin'), controller.setFalse);
router.post('/forgotPassword/:email', controller.forgotPassword);
router.get('/getByToken/:token', controller.getByToken);
router.post('/setPasswordByToken/:token/:newPassword', controller.setPasswordByToken);

/**
 * Client CRUD routes
 */
router.get('/client/:id/:clientId', controller.showClient);
router.get('/client/:id', controller.showClients);
router.put('/clientUpdate/:id/:clientId', controller.upsertClient);
router.delete('/clientDelete/:id/:clientId', controller.destroyClient);
router.post('/clientNew/:id', controller.createClient);
router.post('/clientAccess/:id/:email/:clientId', controller.clientAccess);
router.get('/sharedClients/:id', controller.getSharedClients);
router.delete('/removeSharedClient/:id/:sharedId', controller.removeSharedClient);

/**
 * Assessment CRUD routes
 */
router.get('/assessment/:id/:clientId', controller.showAssessments);
router.get('/assessment/:id/:clientId/:assessmentId', controller.showAssessment);
router.post('/assessmentNew/:id/:clientId', controller.createAssessment);
router.put('/assessmentUpdate/:id/:clientId/:assessmentId', controller.upsertAssessment);
router.delete('/assessmentDelete/:id/:clientId/:assessmentId', controller.destroyAssessment);
router.get('/compare/:tempName', controller.getAllAssessmentsByName);
router.get('/comparebycountry/:country', controller.getAllAssessmentsByCountry);
router.get('/comparebyindustry/:industry', controller.getAllAssessmentsByIndustry);
router.get('/comparebycountryindustry/:country/:industry', controller.getAllAssessmentsByCountryIndustry)

/**
 * Assessment template CRUD routes
 */
router.get('/template/:id', controller.showTemplates);
router.get('/template/:id/:assessmentId', controller.showTemplate)
router.delete('/templateDelete/:id/:assessmentId', controller.destroyTemplate);
router.post('/templateNew/:id', controller.createTemplate);

/**
 * Assessment template->forms CRUD routes
 */
router.get('/template/form/:id/:assessmentId', controller.showForms);
router.put('/template/formUpdate/:id/:assessmentId/:formId', controller.upsertForm);
router.delete('/template/formDelete/:id/:assessmentId/:formId', controller.destroyForm);
router.post('/template/formNew/:id/:assessmentId/', controller.createForm);

/**
 * Assessment template->forms->questions CRUD routes
 */
router.get('/template/question/:id/:assessmentId/:formId', controller.showQuestions);
router.put('/template/questionUpdate/:id/:assessmentId/:formId/:questionId', controller.upsertQuestion);
router.delete('/template/questionDelete/:id/:assessmentId/:formId/:questionId', controller.destroyQuestion);
router.post('/template/questionNew/:id/:assessmentId/:formId', controller.createQuestion);

module.exports = router;