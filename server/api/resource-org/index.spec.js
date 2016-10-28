'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ResourceOrgCtrlStub = {
  index: 'ResourceOrgCtrl.index',
  show: 'ResourceOrgCtrl.show',
  create: 'ResourceOrgCtrl.create',
  upsert: 'ResourceOrgCtrl.upsert',
  patch: 'ResourceOrgCtrl.patch',
  destroy: 'ResourceOrgCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ResourceOrgIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ResourceOrg.controller': ResourceOrgCtrlStub
});

describe('ResourceOrg API Router:', function() {
  it('should return an express router instance', function() {
    ResourceOrgIndex.should.equal(routerStub);
  });

  describe('GET /api/resource-orgs', function() {
    it('should route to ResourceOrg.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ResourceOrgCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/resource-orgs/:id', function() {
    it('should route to ResourceOrg.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ResourceOrgCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/resource-orgs', function() {
    it('should route to ResourceOrg.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ResourceOrgCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/resource-orgs/:id', function() {
    it('should route to ResourceOrg.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ResourceOrgCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/resource-orgs/:id', function() {
    it('should route to ResourceOrg.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ResourceOrgCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/resource-orgs/:id', function() {
    it('should route to ResourceOrg.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ResourceOrgCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
