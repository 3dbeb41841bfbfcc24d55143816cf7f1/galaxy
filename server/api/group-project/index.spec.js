'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var groupProjectCtrlStub = {
  index: 'groupProjectCtrl.index',
  show: 'groupProjectCtrl.show',
  create: 'groupProjectCtrl.create',
  update: 'groupProjectCtrl.update',
  destroy: 'groupProjectCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var groupProjectIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './group-project.controller': groupProjectCtrlStub
});

describe('Group Project API Router:', function() {

  it('should return an express router instance', function() {
    groupProjectIndex.should.equal(routerStub);
  });

  describe('GET /api/group-projects', function() {

    it('should route to groupProject.controller.index', function() {
      routerStub.get
        .withArgs('/', 'groupProjectCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/group-projects/:id', function() {

    it('should route to groupProject.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'groupProjectCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/group-projects', function() {

    it('should route to groupProject.controller.create', function() {
      routerStub.post
        .withArgs('/', 'groupProjectCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/group-projects/:id', function() {

    it('should route to groupProject.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'groupProjectCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/group-projects/:id', function() {

    it('should route to groupProject.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'groupProjectCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/group-projects/:id', function() {

    it('should route to groupProject.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'groupProjectCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
