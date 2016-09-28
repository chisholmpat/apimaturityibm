'use strict';

var app = require('../..');
import request from 'supertest';

var newClients;

describe('Clients API:', function() {
  describe('GET /api/clients', function() {
    var clientss;

    beforeEach(function(done) {
      request(app)
        .get('/api/clients')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          clientss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(clientss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/clients', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/clients')
        .send({
          name: 'New Clients',
          info: 'This is the brand new clients!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newClients = res.body;
          done();
        });
    });

    it('should respond with the newly created clients', function() {
      expect(newClients.name).to.equal('New Clients');
      expect(newClients.info).to.equal('This is the brand new clients!!!');
    });
  });

  describe('GET /api/clients/:id', function() {
    var clients;

    beforeEach(function(done) {
      request(app)
        .get(`/api/clients/${newClients._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          clients = res.body;
          done();
        });
    });

    afterEach(function() {
      clients = {};
    });

    it('should respond with the requested clients', function() {
      expect(clients.name).to.equal('New Clients');
      expect(clients.info).to.equal('This is the brand new clients!!!');
    });
  });

  describe('PUT /api/clients/:id', function() {
    var updatedClients;

    beforeEach(function(done) {
      request(app)
        .put(`/api/clients/${newClients._id}`)
        .send({
          name: 'Updated Clients',
          info: 'This is the updated clients!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedClients = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedClients = {};
    });

    it('should respond with the original clients', function() {
      expect(updatedClients.name).to.equal('New Clients');
      expect(updatedClients.info).to.equal('This is the brand new clients!!!');
    });

    it('should respond with the updated clients on a subsequent GET', function(done) {
      request(app)
        .get(`/api/clients/${newClients._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let clients = res.body;

          expect(clients.name).to.equal('Updated Clients');
          expect(clients.info).to.equal('This is the updated clients!!!');

          done();
        });
    });
  });

  describe('PATCH /api/clients/:id', function() {
    var patchedClients;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/clients/${newClients._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Clients' },
          { op: 'replace', path: '/info', value: 'This is the patched clients!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedClients = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedClients = {};
    });

    it('should respond with the patched clients', function() {
      expect(patchedClients.name).to.equal('Patched Clients');
      expect(patchedClients.info).to.equal('This is the patched clients!!!');
    });
  });

  describe('DELETE /api/clients/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/clients/${newClients._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when clients does not exist', function(done) {
      request(app)
        .delete(`/api/clients/${newClients._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
