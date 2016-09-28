'use strict';

describe('Component: AssessmentsComponent', function() {
  // load the controller's module
  beforeEach(module('apiLocalApp.assessments'));

  var AssessmentsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AssessmentsComponent = $componentController('assessments', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
