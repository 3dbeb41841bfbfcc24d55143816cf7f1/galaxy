'use strict';

var app = require('../..');
import request from 'supertest';

var newSquad;

describe('Squad API:', function() {

  describe('GET /api/squads', function() {
    var squads;

    beforeEach(function(done) {
      request(app)
        .get('/api/squads')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          squads = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      squads.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/squads', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/squads')
        .send({
          name: 'New Squad',
          info: 'This is the brand new squad!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSquad = res.body;
          done();
        });
    });

    it('should respond with the newly created squad', function() {
      newSquad.name.should.equal('New Squad');
      newSquad.info.should.equal('This is the brand new squad!!!');
    });

  });

  describe('GET /api/squads/:id', function() {
    var squad;

    beforeEach(function(done) {
      request(app)
        .get('/api/squads/' + newSquad._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          squad = res.body;
          done();
        });
    });

    afterEach(function() {
      squad = {};
    });

    it('should respond with the requested squad', function() {
      squad.name.should.equal('New Squad');
      squad.info.should.equal('This is the brand new squad!!!');
    });

  });

  describe('PUT /api/squads/:id', function() {
    var updatedSquad;

    beforeEach(function(done) {
      request(app)
        .put('/api/squads/' + newSquad._id)
        .send({
          name: 'Updated Squad',
          info: 'This is the updated squad!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSquad = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSquad = {};
    });

    it('should respond with the updated squad', function() {
      updatedSquad.name.should.equal('Updated Squad');
      updatedSquad.info.should.equal('This is the updated squad!!!');
    });

  });

  describe('DELETE /api/squads/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/squads/' + newSquad._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when squad does not exist', function(done) {
      request(app)
        .delete('/api/squads/' + newSquad._id)
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
