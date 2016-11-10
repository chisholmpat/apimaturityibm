'use strict';

describe('Component: HowToComponent', function() {
  // load the controller's module
  beforeEach(module('apiLocalApp.how-to'));

  var HowToComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    HowToComponent = $componentController('how-to', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
