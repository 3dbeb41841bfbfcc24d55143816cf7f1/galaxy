'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var squadCtrlStub = {
  index: 'squadCtrl.index',
  show: 'squadCtrl.show',
  create: 'squadCtrl.create',
  update: 'squadCtrl.update',
  destroy: 'squadCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var squadIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './squad.controller': squadCtrlStub
});

describe('Squad API Router:', function() {

  it('should return an express router instance', function() {
    squadIndex.should.equal(routerStub);
  });

  describe('GET /api/squads', function() {

    it('should route to squad.controller.index', function() {
      routerStub.get
        .withArgs('/', 'squadCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/squads/:id', function() {

    it('should route to squad.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'squadCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/squads', function() {

    it('should route to squad.controller.create', function() {
      routerStub.post
        .withArgs('/', 'squadCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/squads/:id', function() {

    it('should route to squad.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'squadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/squads/:id', function() {

    it('should route to squad.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'squadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/squads/:id', function() {

    it('should route to squad.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'squadCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
