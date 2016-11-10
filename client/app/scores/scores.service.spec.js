'use strict';

describe('Service: scores', function() {
  // load the service's module
  beforeEach(module('apiLocalApp.scores'));

  // instantiate service
  var scores;
  beforeEach(inject(function(_scores_) {
    scores = _scores_;
  }));

  it('should do something', function() {
    expect(!!scores).to.be.true;
  });
});
