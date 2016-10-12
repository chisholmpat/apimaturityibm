'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.count = 0;
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  countClients(user) {
  	this.count = 0;

  	for (var i = 0; i < user.clients.length; i++) {
  		++this.count;
  	}

  	return this.count;
  }//End countClients

  countAssessments(user) {
  	this.count = 0;

  	for (var i = 0; i < user.clients.length; i++) {
  		for (var j = 0; j < user.clients[i].assessments.length; j++) {
  			++this.count;
  		}
  	}

  	return this.count;
  }
}
