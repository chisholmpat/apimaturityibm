'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var FormsCtrlStub = {
  index: 'FormsCtrl.index',
  show: 'FormsCtrl.show',
  create: 'FormsCtrl.create',
  upsert: 'FormsCtrl.upsert',
  patch: 'FormsCtrl.patch',
  destroy: 'FormsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var FormsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './forms.controller': FormsCtrlStub
});

describe('Forms API Router:', function() {
  it('should return an express router instance', function() {
    expect(FormsIndex).to.equal(routerStub);
  });

  describe('GET /forms', function() {
    it('should route to Forms.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'FormsCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /forms/:id', function() {
    it('should route to Forms.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'FormsCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /forms', function() {
    it('should route to Forms.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'FormsCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /forms/:id', function() {
    it('should route to Forms.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'FormsCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /forms/:id', function() {
    it('should route to Forms.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'FormsCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /forms/:id', function() {
    it('should route to Forms.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'FormsCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
