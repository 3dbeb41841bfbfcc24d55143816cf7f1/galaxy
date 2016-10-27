'use strict';

var app = require('../..');
import request from 'supertest';

var newResource;

describe('Resource API:', function() {
  describe('GET /api/resources', function() {
    var resources;

    beforeEach(function(done) {
      request(app)
        .get('/api/resources')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          resources = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      resources.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/resources', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/resources')
        .send({
          name: 'New Resource',
          info: 'This is the brand new resource!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newResource = res.body;
          done();
        });
    });

    it('should respond with the newly created resource', function() {
      newResource.name.should.equal('New Resource');
      newResource.info.should.equal('This is the brand new resource!!!');
    });
  });

  describe('GET /api/resources/:id', function() {
    var resource;

    beforeEach(function(done) {
      request(app)
        .get(`/api/resources/${newResource._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          resource = res.body;
          done();
        });
    });

    afterEach(function() {
      resource = {};
    });

    it('should respond with the requested resource', function() {
      resource.name.should.equal('New Resource');
      resource.info.should.equal('This is the brand new resource!!!');
    });
  });

  describe('PUT /api/resources/:id', function() {
    var updatedResource;

    beforeEach(function(done) {
      request(app)
        .put(`/api/resources/${newResource._id}`)
        .send({
          name: 'Updated Resource',
          info: 'This is the updated resource!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedResource = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedResource = {};
    });

    it('should respond with the original resource', function() {
      updatedResource.name.should.equal('New Resource');
      updatedResource.info.should.equal('This is the brand new resource!!!');
    });

    it('should respond with the updated resource on a subsequent GET', function(done) {
      request(app)
        .get(`/api/resources/${newResource._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let resource = res.body;

          resource.name.should.equal('Updated Resource');
          resource.info.should.equal('This is the updated resource!!!');

          done();
        });
    });
  });

  describe('PATCH /api/resources/:id', function() {
    var patchedResource;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/resources/${newResource._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Resource' },
          { op: 'replace', path: '/info', value: 'This is the patched resource!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedResource = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedResource = {};
    });

    it('should respond with the patched resource', function() {
      patchedResource.name.should.equal('Patched Resource');
      patchedResource.info.should.equal('This is the patched resource!!!');
    });
  });

  describe('DELETE /api/resources/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/resources/${newResource._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when resource does not exist', function(done) {
      request(app)
        .delete(`/api/resources/${newResource._id}`)
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
