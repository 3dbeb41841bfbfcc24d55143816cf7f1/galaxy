'use strict';

var app = require('../..');
import request from 'supertest';

var newResourceOrg;

describe('ResourceOrg API:', function() {
  describe('GET /api/resource-orgs', function() {
    var ResourceOrgs;

    beforeEach(function(done) {
      request(app)
        .get('/api/resource-orgs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ResourceOrgs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ResourceOrgs.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/resource-orgs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/resource-orgs')
        .send({
          name: 'New ResourceOrg',
          info: 'This is the brand new ResourceOrg!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newResourceOrg = res.body;
          done();
        });
    });

    it('should respond with the newly created ResourceOrg', function() {
      newResourceOrg.name.should.equal('New ResourceOrg');
      newResourceOrg.info.should.equal('This is the brand new ResourceOrg!!!');
    });
  });

  describe('GET /api/resource-orgs/:id', function() {
    var ResourceOrg;

    beforeEach(function(done) {
      request(app)
        .get(`/api/resource-orgs/${newResourceOrg._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ResourceOrg = res.body;
          done();
        });
    });

    afterEach(function() {
      ResourceOrg = {};
    });

    it('should respond with the requested ResourceOrg', function() {
      ResourceOrg.name.should.equal('New ResourceOrg');
      ResourceOrg.info.should.equal('This is the brand new ResourceOrg!!!');
    });
  });

  describe('PUT /api/resource-orgs/:id', function() {
    var updatedResourceOrg;

    beforeEach(function(done) {
      request(app)
        .put(`/api/resource-orgs/${newResourceOrg._id}`)
        .send({
          name: 'Updated ResourceOrg',
          info: 'This is the updated ResourceOrg!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedResourceOrg = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedResourceOrg = {};
    });

    it('should respond with the original ResourceOrg', function() {
      updatedResourceOrg.name.should.equal('New ResourceOrg');
      updatedResourceOrg.info.should.equal('This is the brand new ResourceOrg!!!');
    });

    it('should respond with the updated ResourceOrg on a subsequent GET', function(done) {
      request(app)
        .get(`/api/resource-orgs/${newResourceOrg._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ResourceOrg = res.body;

          ResourceOrg.name.should.equal('Updated ResourceOrg');
          ResourceOrg.info.should.equal('This is the updated ResourceOrg!!!');

          done();
        });
    });
  });

  describe('PATCH /api/resource-orgs/:id', function() {
    var patchedResourceOrg;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/resource-orgs/${newResourceOrg._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ResourceOrg' },
          { op: 'replace', path: '/info', value: 'This is the patched ResourceOrg!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedResourceOrg = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedResourceOrg = {};
    });

    it('should respond with the patched ResourceOrg', function() {
      patchedResourceOrg.name.should.equal('Patched ResourceOrg');
      patchedResourceOrg.info.should.equal('This is the patched ResourceOrg!!!');
    });
  });

  describe('DELETE /api/resource-orgs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/resource-orgs/${newResourceOrg._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ResourceOrg does not exist', function(done) {
      request(app)
        .delete(`/api/resource-orgs/${newResourceOrg._id}`)
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
