'use strict';

describe('Component: ClientsComponent', function() {
  // load the controller's module
  beforeEach(module('apiLocalApp.clients'));

  var ClientsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ClientsComponent = $componentController('clients', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
