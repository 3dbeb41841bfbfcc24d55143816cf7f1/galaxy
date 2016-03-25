'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var homeworkCtrlStub = {
  index: 'homeworkCtrl.index',
  show: 'homeworkCtrl.show',
  create: 'homeworkCtrl.create',
  update: 'homeworkCtrl.update',
  destroy: 'homeworkCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var homeworkIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './homework.controller': homeworkCtrlStub
});

describe('Homework API Router:', function() {

  it('should return an express router instance', function() {
    homeworkIndex.should.equal(routerStub);
  });

  describe('GET /api/homeworks', function() {

    it('should route to homework.controller.index', function() {
      routerStub.get
        .withArgs('/', 'homeworkCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/homeworks/:id', function() {

    it('should route to homework.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'homeworkCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/homeworks', function() {

    it('should route to homework.controller.create', function() {
      routerStub.post
        .withArgs('/', 'homeworkCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/homeworks/:id', function() {

    it('should route to homework.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'homeworkCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/homeworks/:id', function() {

    it('should route to homework.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'homeworkCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/homeworks/:id', function() {

    it('should route to homework.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'homeworkCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
