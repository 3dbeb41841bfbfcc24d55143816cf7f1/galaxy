'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var attendanceCtrlStub = {
  index: 'attendanceCtrl.index',
  show: 'attendanceCtrl.show',
  create: 'attendanceCtrl.create',
  update: 'attendanceCtrl.update',
  destroy: 'attendanceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var attendanceIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './attendance.controller': attendanceCtrlStub
});

describe('Attendance API Router:', function() {

  it('should return an express router instance', function() {
    attendanceIndex.should.equal(routerStub);
  });

  describe('GET /api/attendances', function() {

    it('should route to attendance.controller.index', function() {
      routerStub.get
        .withArgs('/', 'attendanceCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/attendances/:id', function() {

    it('should route to attendance.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'attendanceCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/attendances', function() {

    it('should route to attendance.controller.create', function() {
      routerStub.post
        .withArgs('/', 'attendanceCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/attendances/:id', function() {

    it('should route to attendance.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'attendanceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/attendances/:id', function() {

    it('should route to attendance.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'attendanceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/attendances/:id', function() {

    it('should route to attendance.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'attendanceCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
