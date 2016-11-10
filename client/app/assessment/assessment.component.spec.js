'use strict';

describe('Component: AssessmentComponent', function() {
  // load the controller's module
  beforeEach(module('apiLocalApp.assessment'));

  var AssessmentComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AssessmentComponent = $componentController('assessment', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
