'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var resourceCtrlStub = {
  index: 'resourceCtrl.index',
  show: 'resourceCtrl.show',
  create: 'resourceCtrl.create',
  upsert: 'resourceCtrl.upsert',
  patch: 'resourceCtrl.patch',
  destroy: 'resourceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var resourceIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './resource.controller': resourceCtrlStub
});

describe('Resource API Router:', function() {
  it('should return an express router instance', function() {
    resourceIndex.should.equal(routerStub);
  });

  describe('GET /api/resources', function() {
    it('should route to resource.controller.index', function() {
      routerStub.get
        .withArgs('/', 'resourceCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/resources/:id', function() {
    it('should route to resource.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'resourceCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/resources', function() {
    it('should route to resource.controller.create', function() {
      routerStub.post
        .withArgs('/', 'resourceCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/resources/:id', function() {
    it('should route to resource.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'resourceCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/resources/:id', function() {
    it('should route to resource.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'resourceCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/resources/:id', function() {
    it('should route to resource.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'resourceCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
