'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.VCAP_APP_PORT
    || 8080,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://169.46.159.89/27017'
  }
};
