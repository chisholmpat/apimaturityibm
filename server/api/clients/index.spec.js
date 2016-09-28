'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var clientsCtrlStub = {
  index: 'clientsCtrl.index',
  show: 'clientsCtrl.show',
  create: 'clientsCtrl.create',
  upsert: 'clientsCtrl.upsert',
  patch: 'clientsCtrl.patch',
  destroy: 'clientsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var clientsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './clients.controller': clientsCtrlStub
});

describe('Clients API Router:', function() {
  it('should return an express router instance', function() {
    expect(clientsIndex).to.equal(routerStub);
  });

  describe('GET /api/clients', function() {
    it('should route to clients.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'clientsCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/clients/:id', function() {
    it('should route to clients.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'clientsCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/clients', function() {
    it('should route to clients.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'clientsCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/clients/:id', function() {
    it('should route to clients.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'clientsCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/clients/:id', function() {
    it('should route to clients.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'clientsCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/clients/:id', function() {
    it('should route to clients.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'clientsCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
