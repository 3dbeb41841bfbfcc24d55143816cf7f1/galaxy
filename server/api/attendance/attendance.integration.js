'use strict';

var app = require('../..');
import request from 'supertest';

var newAttendance;

describe('Attendance API:', function() {

  describe('GET /api/attendances', function() {
    var attendances;

    beforeEach(function(done) {
      request(app)
        .get('/api/attendances')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          attendances = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      attendances.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/attendances', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/attendances')
        .send({
          name: 'New Attendance',
          info: 'This is the brand new attendance!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAttendance = res.body;
          done();
        });
    });

    it('should respond with the newly created attendance', function() {
      newAttendance.name.should.equal('New Attendance');
      newAttendance.info.should.equal('This is the brand new attendance!!!');
    });

  });

  describe('GET /api/attendances/:id', function() {
    var attendance;

    beforeEach(function(done) {
      request(app)
        .get('/api/attendances/' + newAttendance._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          attendance = res.body;
          done();
        });
    });

    afterEach(function() {
      attendance = {};
    });

    it('should respond with the requested attendance', function() {
      attendance.name.should.equal('New Attendance');
      attendance.info.should.equal('This is the brand new attendance!!!');
    });

  });

  describe('PUT /api/attendances/:id', function() {
    var updatedAttendance;

    beforeEach(function(done) {
      request(app)
        .put('/api/attendances/' + newAttendance._id)
        .send({
          name: 'Updated Attendance',
          info: 'This is the updated attendance!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAttendance = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAttendance = {};
    });

    it('should respond with the updated attendance', function() {
      updatedAttendance.name.should.equal('Updated Attendance');
      updatedAttendance.info.should.equal('This is the updated attendance!!!');
    });

  });

  describe('DELETE /api/attendances/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/attendances/' + newAttendance._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when attendance does not exist', function(done) {
      request(app)
        .delete('/api/attendances/' + newAttendance._id)
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
