'use strict';

var app = require('../..');
import request from 'supertest';

var newAssessments;

describe('Assessments API:', function() {
  describe('GET /api/assessments', function() {
    var assessmentss;

    beforeEach(function(done) {
      request(app)
        .get('/api/assessments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          assessmentss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(assessmentss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/assessments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/assessments')
        .send({
          name: 'New Assessments',
          info: 'This is the brand new assessments!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAssessments = res.body;
          done();
        });
    });

    it('should respond with the newly created assessments', function() {
      expect(newAssessments.name).to.equal('New Assessments');
      expect(newAssessments.info).to.equal('This is the brand new assessments!!!');
    });
  });

  describe('GET /api/assessments/:id', function() {
    var assessments;

    beforeEach(function(done) {
      request(app)
        .get(`/api/assessments/${newAssessments._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          assessments = res.body;
          done();
        });
    });

    afterEach(function() {
      assessments = {};
    });

    it('should respond with the requested assessments', function() {
      expect(assessments.name).to.equal('New Assessments');
      expect(assessments.info).to.equal('This is the brand new assessments!!!');
    });
  });

  describe('PUT /api/assessments/:id', function() {
    var updatedAssessments;

    beforeEach(function(done) {
      request(app)
        .put(`/api/assessments/${newAssessments._id}`)
        .send({
          name: 'Updated Assessments',
          info: 'This is the updated assessments!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAssessments = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAssessments = {};
    });

    it('should respond with the original assessments', function() {
      expect(updatedAssessments.name).to.equal('New Assessments');
      expect(updatedAssessments.info).to.equal('This is the brand new assessments!!!');
    });

    it('should respond with the updated assessments on a subsequent GET', function(done) {
      request(app)
        .get(`/api/assessments/${newAssessments._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let assessments = res.body;

          expect(assessments.name).to.equal('Updated Assessments');
          expect(assessments.info).to.equal('This is the updated assessments!!!');

          done();
        });
    });
  });

  describe('PATCH /api/assessments/:id', function() {
    var patchedAssessments;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/assessments/${newAssessments._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Assessments' },
          { op: 'replace', path: '/info', value: 'This is the patched assessments!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAssessments = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAssessments = {};
    });

    it('should respond with the patched assessments', function() {
      expect(patchedAssessments.name).to.equal('Patched Assessments');
      expect(patchedAssessments.info).to.equal('This is the patched assessments!!!');
    });
  });

  describe('DELETE /api/assessments/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/assessments/${newAssessments._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when assessments does not exist', function(done) {
      request(app)
        .delete(`/api/assessments/${newAssessments._id}`)
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
