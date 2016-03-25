'use strict';

var app = require('../..');
import request from 'supertest';

var newHomework;

describe('Homework API:', function() {

  describe('GET /api/homeworks', function() {
    var homeworks;

    beforeEach(function(done) {
      request(app)
        .get('/api/homeworks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          homeworks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      homeworks.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/homeworks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/homeworks')
        .send({
          name: 'New Homework',
          info: 'This is the brand new homework!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newHomework = res.body;
          done();
        });
    });

    it('should respond with the newly created homework', function() {
      newHomework.name.should.equal('New Homework');
      newHomework.info.should.equal('This is the brand new homework!!!');
    });

  });

  describe('GET /api/homeworks/:id', function() {
    var homework;

    beforeEach(function(done) {
      request(app)
        .get('/api/homeworks/' + newHomework._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          homework = res.body;
          done();
        });
    });

    afterEach(function() {
      homework = {};
    });

    it('should respond with the requested homework', function() {
      homework.name.should.equal('New Homework');
      homework.info.should.equal('This is the brand new homework!!!');
    });

  });

  describe('PUT /api/homeworks/:id', function() {
    var updatedHomework;

    beforeEach(function(done) {
      request(app)
        .put('/api/homeworks/' + newHomework._id)
        .send({
          name: 'Updated Homework',
          info: 'This is the updated homework!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedHomework = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHomework = {};
    });

    it('should respond with the updated homework', function() {
      updatedHomework.name.should.equal('Updated Homework');
      updatedHomework.info.should.equal('This is the updated homework!!!');
    });

  });

  describe('DELETE /api/homeworks/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/homeworks/' + newHomework._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when homework does not exist', function(done) {
      request(app)
        .delete('/api/homeworks/' + newHomework._id)
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
