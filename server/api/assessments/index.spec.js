'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var assessmentsCtrlStub = {
  index: 'assessmentsCtrl.index',
  show: 'assessmentsCtrl.show',
  create: 'assessmentsCtrl.create',
  upsert: 'assessmentsCtrl.upsert',
  patch: 'assessmentsCtrl.patch',
  destroy: 'assessmentsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var assessmentsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './assessments.controller': assessmentsCtrlStub
});

describe('Assessments API Router:', function() {
  it('should return an express router instance', function() {
    expect(assessmentsIndex).to.equal(routerStub);
  });

  describe('GET /api/assessments', function() {
    it('should route to assessments.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'assessmentsCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/assessments/:id', function() {
    it('should route to assessments.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'assessmentsCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/assessments', function() {
    it('should route to assessments.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'assessmentsCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/assessments/:id', function() {
    it('should route to assessments.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'assessmentsCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/assessments/:id', function() {
    it('should route to assessments.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'assessmentsCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/assessments/:id', function() {
    it('should route to assessments.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'assessmentsCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
