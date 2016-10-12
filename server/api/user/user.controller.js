'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}

/**
 * CRUD for Client sub-documents
 */

/**
 * Get an instance of a client
 */
export function showClient(req, res) {
  var userId = req.params.id, clientId = req.params.clientId;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    res.json(client);
  })
}//End indexClients

/**
 * Save a new client
 */
export function createClient(req, res) { 
  var userId = req.params.id, newClient = req.body;

  User.findById(userId).exec()
  .then(user => {
    var clients = user.clients.push(newClient);

    user.save(function (err, clients) {
      if (err) return handleError(err)
      res.json(clients);
    })
  })
}//End createClient

/**
 * Delete a client
 */
export function destroyClient(req, res) {
  var userId = req.params.id, clientId = req.params.clientId;

  User.findById(userId).exec()
  .then(user => {
    user.clients.id(clientId).remove();

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End destroyClient

/**
 * Update a client
 */
export function upsertClient(req, res) {
  var userId = req.params.id, clientId = req.params.clientId, clientEdit = req.body;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    Object.assign(client, clientEdit);

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End upsertClient

/**
 * CRD for user assessment sub-documents
 */

/**
 * Get assessment sub-documents
 */
export function showAssessments(req, res) {
  var userId = req.params.id, clientId = req.params.clientId;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    var assessments = client.assessments;

    res.json(assessments);
  })
}//End showAssessment

/**
 * Get an instance of an assessment sub-document
 */
export function showAssessment(req, res) {
  var userId = req.params.id, clientId = req.params.clientId, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    var assessment = client.assessments.id(assessmentId);

    res.json(assessment);
  })
}//End indexClients

/**
 * Create an assessment sub-document
 */
export function createAssessment(req, res) { 
  var userId = req.params.id, clientId = req.params.clientId, newAssessment = req.body, client;

  User.findById(userId).exec()
  .then(user => {
    client = user.clients.id(clientId);
    client.assessments.push(newAssessment);

    user.save(function (err, clients) {
      if (err) return handleError(err)
      var savedAssessment;

      for (var i = 0; i < client.assessments.length; i++) {
        if (client.assessments[i].name === newAssessment.name) {
          savedAssessment = client.assessments[i];
        }
      }

      res.json(savedAssessment);
    })
  })
}//End createAssessment

/**
 * Delete an assessment sub-document
 */
export function destroyAssessment(req, res) { 
  var userId = req.params.id, clientId = req.params.clientId, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    client.assessments.id(assessmentId).remove();

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End destroyAssessment

/**
 * CRD for user assessmentTemplate sub-documents
 */

 /**
 * Show an instance of a template object
 */
export function showTemplate(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    console.log(user);
    var template = user.assessmentTemplates.id(assessmentId);

    res.json(template);
  })
}//End showTemplate

/**
 * Show a list of templates
 */
export function showTemplates(req, res) {
  var userId = req.params.id;

  User.findById(userId).exec()
  .then(user => {
    var templates = user.assessmentTemplates;

    res.json(templates);
  })
}//End showTemplates

/**
 * Create a new template assessment
 */
export function createTemplate(req, res) { 
  var userId = req.params.id, newTemplate = req.body;

  User.findById(userId).exec()
  .then(user => { 
    user.assessmentTemplates.push(newTemplate);
    var assessmentTemplates = user.assessmentTemplates; 

    user.save(function (err, clients) {
      if (err) return handleError(err)
      res.json(assessmentTemplates);
    })
  })
}//End createTemplate

/**
 * Delete a template assessment
 */
export function destroyTemplate(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    user.assessmentTemplates.id(assessmentId).remove();

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End destroyTemplate

/**
 * CRUD for form sub-documents
 */

/**
 * Show all form groups in the assessment template
 */
export function showTemplateForms(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var forms = assessmentTemplate.assessment;
    res.json(forms); 
  })
 }//End showTemplate forms

/**
 * Create a form group in the assessment template
 */
export function createForm(req, res) { 
  var userId = req.params.id, assessmentId = req.params.assessmentId, newForm = req.body;

  User.findById(userId).exec()
  .then(user => { 
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    assessmentTemplate.assessment.push(newForm);
    var forms = assessmentTemplate.assessment; 

    user.save(function (err, clients) {
      if (err) return handleError(err)
      res.json(forms);
    })
  })
}//End createForm

/**
 * Delete a form in the assessment template
 */
export function destroyForm(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    assessmentTemplate.assessment.id(formId).remove();

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End destroyTemplate

/**
 * Update a form in the assessment template
 */
export function upsertForm(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId,
    formEdit = req.body;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var form = assessmentTemplate.assessment.id(formId);
    Object.assign(form, formEdit);

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End upsertForm

/**
 * Crud for question sub-documents
 */

/**
 * Show questions in form
 */
export function showFormQuestions(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var form = assessmentTemplate.assessment.id(formId);
    var questions = form.questions;

    res.json(questions)
  })
}//End showFormQuestions

/**
 * Create a new question in form
 */
export function createQuestion(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId,
   newQuestion = req.body;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var form = assessmentTemplate.assessment.id(formId);
    form.questions.push(newQuestion);
    var questions = form.questions;

    user.save(function (err, clients) {
      if (err) return handleError(err)
      res.json(questions);
    })
  })
}//End createQuestion

/**
 * Delete a question in the form
 */
export function destroyQuestion(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId,
    questionId = req.params.questionId;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var form = assessmentTemplate.assessment.id(formId);
    form.questions.id(questionId).remove();

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End destroyQuestion

/**
 * Update a question in the form
 */
export function upsertQuestion(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId,
    questionId = req.params.questionId, questionEdit = req.body;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var form = assessmentTemplate.assessment.id(formId);
    var question = form.questions.id(questionId);
    Object.assign(question, questionEdit);

    user.save(function (err) {
      if (err) return handleError(err)
      res.status(204).end();
    })
  })
}//End upsertQuestion