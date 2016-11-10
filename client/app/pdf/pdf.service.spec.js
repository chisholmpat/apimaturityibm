'use strict';

describe('Service: pdf', function() {
  // load the service's module
  beforeEach(module('apiLocalApp.pdf'));

  // instantiate service
  var pdf;
  beforeEach(inject(function(_pdf_) {
    pdf = _pdf_;
  }));

  it('should do something', function() {
    expect(!!pdf).to.be.true;
  });
});
