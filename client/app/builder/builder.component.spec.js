'use strict';

describe('Component: BuilderComponent', function() {
  // load the controller's module
  beforeEach(module('apiLocalApp.builder'));

  var BuilderComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BuilderComponent = $componentController('builder', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
