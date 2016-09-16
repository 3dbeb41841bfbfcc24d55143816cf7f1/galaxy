'use strict';

var app = require('../..');
import request from 'supertest';

var newGroupProject;

describe('GroupProject API:', function() {

  describe('GET /api/group-projects', function() {
    var groupProjects;

    beforeEach(function(done) {
      request(app)
        .get('/api/group-projects')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          groupProjects = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      groupProjects.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/group-projects', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/group-projects')
        .send({
          name: 'New Group Project',
          info: 'This is the brand new group project!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGroupProject = res.body;
          done();
        });
    });

    it('should respond with the newly created group project', function() {
      newGroupProject.name.should.equal('New Group Project');
      newGroupProject.info.should.equal('This is the brand new group project!!!');
    });

  });

  describe('GET /api/group-projects/:id', function() {
    var groupProject;

    beforeEach(function(done) {
      request(app)
        .get('/api/group-projects/' + newGroupProject._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          groupProject = res.body;
          done();
        });
    });

    afterEach(function() {
      groupProject = {};
    });

    it('should respond with the requested group project', function() {
      groupProject.name.should.equal('New Group Project');
      groupProject.info.should.equal('This is the brand new group project!!!');
    });

  });

  describe('PUT /api/group-projects/:id', function() {
    var updatedGroupProject;

    beforeEach(function(done) {
      request(app)
        .put('/api/group-projects/' + newGroupProject._id)
        .send({
          name: 'Updated Group Project',
          info: 'This is the updated group project!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGroupProject = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGroupProject = {};
    });

    it('should respond with the updated group project', function() {
      updatedGroupProject.name.should.equal('Updated Group Project');
      updatedGroupProject.info.should.equal('This is the updated group project!!!');
    });

  });

  describe('DELETE /api/group-projects/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/group-projects/' + newGroupProject._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when group project does not exist', function(done) {
      request(app)
        .delete('/api/group-projects/' + newGroupProject._id)
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
