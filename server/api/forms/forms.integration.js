'use strict';

var app = require('../..');
import request from 'supertest';

var newForms;

describe('Forms API:', function() {
  describe('GET /forms', function() {
    var Formss;

    beforeEach(function(done) {
      request(app)
        .get('/forms')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Formss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(Formss).to.be.instanceOf(Array);
    });
  });

  describe('POST /forms', function() {
    beforeEach(function(done) {
      request(app)
        .post('/forms')
        .send({
          name: 'New Forms',
          info: 'This is the brand new Forms!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newForms = res.body;
          done();
        });
    });

    it('should respond with the newly created Forms', function() {
      expect(newForms.name).to.equal('New Forms');
      expect(newForms.info).to.equal('This is the brand new Forms!!!');
    });
  });

  describe('GET /forms/:id', function() {
    var Forms;

    beforeEach(function(done) {
      request(app)
        .get(`/forms/${newForms._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          Forms = res.body;
          done();
        });
    });

    afterEach(function() {
      Forms = {};
    });

    it('should respond with the requested Forms', function() {
      expect(Forms.name).to.equal('New Forms');
      expect(Forms.info).to.equal('This is the brand new Forms!!!');
    });
  });

  describe('PUT /forms/:id', function() {
    var updatedForms;

    beforeEach(function(done) {
      request(app)
        .put(`/forms/${newForms._id}`)
        .send({
          name: 'Updated Forms',
          info: 'This is the updated Forms!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedForms = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedForms = {};
    });

    it('should respond with the original Forms', function() {
      expect(updatedForms.name).to.equal('New Forms');
      expect(updatedForms.info).to.equal('This is the brand new Forms!!!');
    });

    it('should respond with the updated Forms on a subsequent GET', function(done) {
      request(app)
        .get(`/forms/${newForms._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let Forms = res.body;

          expect(Forms.name).to.equal('Updated Forms');
          expect(Forms.info).to.equal('This is the updated Forms!!!');

          done();
        });
    });
  });

  describe('PATCH /forms/:id', function() {
    var patchedForms;

    beforeEach(function(done) {
      request(app)
        .patch(`/forms/${newForms._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Forms' },
          { op: 'replace', path: '/info', value: 'This is the patched Forms!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedForms = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedForms = {};
    });

    it('should respond with the patched Forms', function() {
      expect(patchedForms.name).to.equal('Patched Forms');
      expect(patchedForms.info).to.equal('This is the patched Forms!!!');
    });
  });

  describe('DELETE /forms/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/forms/${newForms._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Forms does not exist', function(done) {
      request(app)
        .delete(`/forms/${newForms._id}`)
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
