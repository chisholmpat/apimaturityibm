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
router.get('/assessmentList/:id/:clientId/:assessmentId', controller.showAssessment);
router.post('/assessmentNew/:id/:clientId', controller.createAssessment);
module.exports = router;

// router.get('/clientList/:id/:clientId', controller.indexClients);
// router.get('/assessmentList/:id/:clientId/:assessmentId', controller.indexAssessments);
// router.post('/clientNew/:id', controller.createClient);
// router.post('/assessmentNew/:id/:clientId/:assessmentId', controller.createAssessment);
// router.delete('/clientDelete/:id/:clientId', controller.destroyClient);
// router.delete('/assessmentDelete/:id/:clientId/:assessmentId', controller.destroyAssessment);
// router.put('/clientUpdate/:id/:clientId', controller.upsertClients);
// router.put('/assessmentUpdate/:id/:clientId/:assessmentId', controller.upsertAssessment)