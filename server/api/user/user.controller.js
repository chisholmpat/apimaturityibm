'use strict';

import User from './user.model';
import config from '../../config/environment';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { defaultTemplate } from './default_template.seed';

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
    console.log(err);
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
 export function index(req, res) {
  return User.find({'active' : true}, '-salt -password').exec()
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
  newUser.assessmentTemplates = defaultTemplate;
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
 * Creates a new user
 */
 export function adminCreate(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()  
  .then(function(user) {
    res.json(user);
  })
  .catch(validationError(res));
}//End adminCreate

/**
 * Updates a user
 */
 export function adminUpdate(req, res) {
  var userId = req.params.id, userEdit = req.body;

  User.findById(userId).exec()
  .then(user => {
    Object.assign(user, userEdit);

    user.save(function (err) {
      if (err) return handleError(err)
        res.status(204).end();
    })
  })
}//End upsertClient

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
 * Deactivates a user
 * restriction: 'admin'
 */
 export function setFalse(req, res) {
  return User.findById(req.params.id).exec()
  .then(user => {
    user.active = false;

    user.save(function (err) {
      if (err) return handleError(err)
        res.status(204).end();
    })
  })
  .catch(handleError(res));
}//End setFalse

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
 * Set reset token && send e-mail
 */
 export function forgotPassword(req, res) {
  User.findOne({email: req.params.email}).exec()
  .then(user => {
    if (!user) {
      return res.end('notUser');
    }

    crypto.randomBytes(20, function(err, buf) {
      var token = buf.toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      user.save()
      .then(user => {
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport('smtps://chisholm.p@gmail.com:thinkpower2@smtp.gmail.com');

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"API Maturity Staff" <admin@api-maturity.com>', // sender address
            to: user.email, // list of receivers
            subject: 'API Maturity Password Reset', // Subject line
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + user.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error);
            return res.end('didntSend');
          }
          console.log('Message sent: ' + info.response);
          return res.end('sent');
        });
      })
    })
  })
}

export function getByToken(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, '-salt').exec()
  .then(user => {
    if (!user) {
      res.end('notUser');
    }

    res.json(user);
  })
}//End getByToken

export function setPasswordByToken(req, res) {
  var newPassword = req.params.newPassword;

  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, '-salt').exec()
  .then(user => {
    if (!user) {
      res.end('notUser');
    }
    user.password = newPassword;
    user.resetPasswordToken = '';

    user.save(function (err) {
      if (err) return handleError(err)
        res.status(204).end();
    })
  })
}//End getByToken

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

  export function recentActivity(req, res) {
    var userId = req.params.id;
    var currentDate = new Date(), resObj = {}, datesArr = [], labelsArr = [], countArr = [], queriesToPerform;
    var date = currentDate.getDate(), month = currentDate.getMonth(), year = currentDate.getFullYear();
    var onComplete = function() {
      for (var x = 0; x < datesArr.length; x++) {
        countArr.push(datesArr[x].count);
      }
      resObj.labels = labelsArr;
      resObj.counts = countArr;
      resObj.data = datesArr;
      res.json(resObj);
    }//End onComplete

    for (var i = date; i > 0; i--) {
      var dateObj = {count: 0};
      dateObj.day = new Date(year, month, i);
      var dayStr = dateObj.day.toISOString().substring(0, 10);
      datesArr.push(dateObj);
      labelsArr.push(dayStr);
    }//End for

    User.findById(userId).exec()
    .then(user => {
      var queriesToPerform = user.clients.length;
      if (queriesToPerform === 0) onComplete();

      user.clients.forEach(function(client) {
        client.assessments.forEach(function(assessment) {
          for (var j = 0; j < datesArr.length; j++) {
            if (datesArr[j].day.setHours(0,0,0,0) == assessment.created.setHours(0,0,0,0)) 
              datesArr[j].count++;
          }//End nested for
        })//End nested forEach
        if (--queriesToPerform === 0) onComplete();
      })//End forEach
    })//End findById
  }//End recentActivity

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
}//End showClient

/**
 * Get a list of client objects
 */
 export function showClients(req, res) {
  var userId = req.params.id;

  User.findById(userId).exec()
  .then(user => {
    var clients = user.clients;

    res.json(clients);
  })
}//End showClients

/**
 * Save a new client
 */
 export function createClient(req, res) { 
  var userId = req.params.id, newClient = req.body;

  User.findById(userId).exec()
  .then(user => {
    user.clients.push(newClient);
    var clientsCopy = user.clients;

    user.save(function (err) {
      if (err) return handleError(err)
        res.json(clientsCopy);
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
    });
  });
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
    });
  });
}//End upsertClient


/**
 * Adds an entry to shared clients array
 */
 export function clientAccess(req, res) {
  var userId = req.params.id, emailCopy = req.params.email, clientId = req.params.clientId;
  var sharedClient, sharedObj;

  User.findById(userId).exec()
  .then(user => {
    if(!user) {
      return res.status(404).end();
    }
    if (user.email == emailCopy) {
      return res.end('sameEmail');
    }

    sharedClient = user.clients.id(clientId);
    sharedObj = {
      uid: userId,
      cid: sharedClient._id
    };

    User.findOne({'email': emailCopy}).exec()
    .then(userTwo => {
      if(!userTwo) {
        return res.end('notFound');
      }

      var queriesToPerform = userTwo.sharedClients.length;
      var onComplete = function() {
        userTwo.sharedClients.push(sharedObj);
        userTwo.save(function (err) {
          if (err) return handleError(err)
            res.status(204).end();
        });//End save
      }//End onComplete

      if (queriesToPerform === 0) onComplete();

      userTwo.sharedClients.forEach(function(obj) {
        if (obj.client._id == clientId)
          return res.end('shared');

        if (--queriesToPerform === 0) onComplete();
      })//End forEach
    });//End userTwo save
  });//End user save
}//End clientAccess

/**
 * Gets all shared clients for a user
 */
 export function getSharedClients(req, res) {
  var userId = req.params.id, shareArr = [];
  var onComplete = function() {
    res.json(shareArr);
  }

  User.findById(userId).exec()
  .then(user => {
    if(!user) {
      return res.status(404).end();
    }

    var queriesToPerform = user.sharedClients.length;
    var onComplete = function() {
      res.json(user.sharedClients);
    }//End onComplete

    if (queriesToPerform === 0) onComplete();

    user.sharedClients.forEach(function(shared) {
      console.log(shared);
      User.findById(shared.uid).exec()
      .then(sharedUser => {
        console.log('hit');
        shared.client = sharedUser.clients.id(shared.cid);
        user.save(function (err) {
          if (err) return handleError(err);
        });
        console.log(shared);
      })
      if (--queriesToPerform === 0) onComplete();
    })
  })//End findById
}//End getSharedClients

export function removeSharedClient(req, res) {
  var userId = req.params.id, sharedId = req.params.sharedId;

  User.findById(userId).exec()
  .then(user => {
    user.sharedClients.id(sharedId).remove();

    user.save(function (err) {
      if (err) return handleError(err)
        res.status(204).end();
    });
  });
}//End removeSharedClient

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

    user.save(function (err) {
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
 * Update an assessment sub-document
 */
 export function upsertAssessment(req, res) {
  var userId = req.params.id, clientId = req.params.clientId, assessmentId = req.params.assessmentId,
  assessmentEdit = req.body;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    var assessment = client.assessments.id(assessmentId);
    Object.assign(assessment, assessmentEdit);

    user.save(function (err) {
      if (err) return handleError(err)
        res.json(assessment);
    })
  })
}//End upsertClient

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
 * Get all copies of the API-Maturity Template
 */
 export function getAllAssessmentsByName(req, res) {
  var tempName = req.params.tempName, assessmentArr = [];

  return User.find({}).exec()
  .then(users => {

    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < users[i].clients.length; j++) {
        for (var a = 0; a < users[i].clients[j].assessments.length; a++) {
          if (users[i].clients[j].assessments[a].tempName === 'API-Maturity Template') {
            assessmentArr.push(users[i].clients[j].assessments[a]);
          }
        }
      }
    }
    res.status(200).json(assessmentArr);
  })
  .catch(handleError(res));
}//End getAllAssessmentsByName

/**
 * Get all copies of the API-Maturity Template by country
 */
 export function getAllAssessmentsByCountry(req, res) {
  var country = req.params.country, assessmentArr = [];

  return User.find({}).exec()
  .then(users => {
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < users[i].clients.length; j++) {
        if(users[i].clients[j].country === country) {
          for (var a = 0; a < users[i].clients[j].assessments.length; a++) {
            if (users[i].clients[j].assessments[a].tempName === 'API-Maturity Template') {
              assessmentArr.push(users[i].clients[j].assessments[a]);
            }
          }
        }
      }
    }
    res.status(200).json(assessmentArr);
  })
  .catch(handleError(res));
}//End getAllAssessmentsByCountry

/**
 * Get all copies of the API-Maturity Template by industry
 */
 export function getAllAssessmentsByIndustry(req, res) {
  var industry = req.params.industry, assessmentArr = [];

  return User.find({}).exec()
  .then(users => {
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < users[i].clients.length; j++) {
        if(users[i].clients[j].industry === industry) {
          for (var a = 0; a < users[i].clients[j].assessments.length; a++) {
            if (users[i].clients[j].assessments[a].tempName === 'API-Maturity Template') {
              assessmentArr.push(users[i].clients[j].assessments[a]);
            }
          }
        }
      }
    }
    res.status(200).json(assessmentArr);
  })
  .catch(handleError(res));
}//End getAllAssessmentsByCountry

/**
 * Get all assessments by country & industry
 */
 export function getAllAssessmentsByCountryIndustry(req, res) {
  var country = req.params.country, industry = req.params.industry, assessmentArr = [];

  return User.find({}).exec()
  .then(users => {
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < users[i].clients.length; j++) {
        if(users[i].clients[j].country === country && users[i].clients[j].industry === industry) {
          for (var a = 0; a < users[i].clients[j].assessments.length; a++) {
            if (users[i].clients[j].assessments[a].tempName === 'API-Maturity Template') {
              assessmentArr.push(users[i].clients[j].assessments[a]);
            }
          }
        }
      }
    }
    res.status(200).json(assessmentArr);
  })
  .catch(handleError(res));
}//End getAllAssessmentsByCountryIndustry

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

    user.save(function (err) {
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
 export function showForms(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var forms = assessmentTemplate.assessment;
    res.json(forms); 
  })
 }//End showForms

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

    user.save(function (err) {
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
}//End destroyForm

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
 export function showQuestions(req, res) {
  var userId = req.params.id, assessmentId = req.params.assessmentId, formId = req.params.formId;

  User.findById(userId).exec()
  .then(user => {
    var assessmentTemplate = user.assessmentTemplates.id(assessmentId);
    var form = assessmentTemplate.assessment.id(formId);
    var questions = form.questions;

    res.json(questions)
  })
}//End showQuestions

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

    user.save(function (err) {
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