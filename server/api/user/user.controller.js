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
 * Get a list of clients
 */
export function showClient(req, res) {
  var userId = req.params.id, clientId = req.params.clientId;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    res.json(client);
  })//End UserFind
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
 * Delete a client
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
  })//End promise
 }//End upsertClient

/**
 * Crud for a assessments
 */

export function showAssessment(req, res) {
  var userId = req.params.id, clientId = req.params.clientId, assessmentId = req.params.assessmentId;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    var assessment = client.assessments.id(assessmentId);
    res.json(assessment);
  })//End UserFind
}//End indexClients

export function createAssessment(req, res) { 
  var userId = req.params.id, clientId = req.params.clientId, newAssessment = req.body;

  User.findById(userId).exec()
  .then(user => {
    var client = user.clients.id(clientId);
    client.assessments.push(newAssessment);

    user.save(function (err, clients) {
      if (err) return handleError(err)
      res.json(clients);
    })
  })
}//End createClient
