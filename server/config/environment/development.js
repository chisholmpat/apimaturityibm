'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/apilocal-dev'
  },

  // Seed database on startup
  seedDB: true

};
 // localdb: mongodb://localhost/apilocal-dev
 // clouddb: mongodb://169.46.159.89/27017