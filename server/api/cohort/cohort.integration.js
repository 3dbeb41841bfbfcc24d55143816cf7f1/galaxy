'use strict';

var app = require('../..');
import request from 'supertest';

var newCohort;

describe('Cohort API:', function() {

  describe('GET /api/cohorts', function() {
    var cohorts;

    beforeEach(function(done) {
      request(app)
        .get('/api/cohorts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cohorts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cohorts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/cohorts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cohorts')
        .send({
          name: 'New Cohort',
          info: 'This is the brand new cohort!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCohort = res.body;
          done();
        });
    });

    it('should respond with the newly created cohort', function() {
      newCohort.name.should.equal('New Cohort');
      newCohort.info.should.equal('This is the brand new cohort!!!');
    });

  });

  describe('GET /api/cohorts/:id', function() {
    var cohort;

    beforeEach(function(done) {
      request(app)
        .get('/api/cohorts/' + newCohort._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cohort = res.body;
          done();
        });
    });

    afterEach(function() {
      cohort = {};
    });

    it('should respond with the requested cohort', function() {
      cohort.name.should.equal('New Cohort');
      cohort.info.should.equal('This is the brand new cohort!!!');
    });

  });

  describe('PUT /api/cohorts/:id', function() {
    var updatedCohort;

    beforeEach(function(done) {
      request(app)
        .put('/api/cohorts/' + newCohort._id)
        .send({
          name: 'Updated Cohort',
          info: 'This is the updated cohort!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCohort = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCohort = {};
    });

    it('should respond with the updated cohort', function() {
      updatedCohort.name.should.equal('Updated Cohort');
      updatedCohort.info.should.equal('This is the updated cohort!!!');
    });

  });

  describe('DELETE /api/cohorts/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/cohorts/' + newCohort._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cohort does not exist', function(done) {
      request(app)
        .delete('/api/cohorts/' + newCohort._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
