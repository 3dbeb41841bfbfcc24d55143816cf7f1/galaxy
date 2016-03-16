'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var cohortCtrlStub = {
  index: 'cohortCtrl.index',
  show: 'cohortCtrl.show',
  create: 'cohortCtrl.create',
  update: 'cohortCtrl.update',
  destroy: 'cohortCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cohortIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './cohort.controller': cohortCtrlStub
});

describe('Cohort API Router:', function() {

  it('should return an express router instance', function() {
    cohortIndex.should.equal(routerStub);
  });

  describe('GET /api/cohorts', function() {

    it('should route to cohort.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cohortCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/cohorts/:id', function() {

    it('should route to cohort.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cohortCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/cohorts', function() {

    it('should route to cohort.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cohortCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/cohorts/:id', function() {

    it('should route to cohort.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'cohortCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/cohorts/:id', function() {

    it('should route to cohort.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'cohortCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/cohorts/:id', function() {

    it('should route to cohort.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cohortCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
