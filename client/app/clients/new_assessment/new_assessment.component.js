'use strict';

export default class NewAssessmentComponent {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $cookies, $state, socket, Auth) {
    this.$http = $http;
    this.$cookies = $cookies;
    this.$state = $state;
    this.socket = socket;
    this.sharedSelected = this.$cookies.get('sharedSelected');

    if (this.sharedSelected === 'true') {
      this.userId = this.$cookies.get('sharedUserId');
    } else if (this.sharedSelected === 'false') {
      this.userId = this.$cookies.get('userId');
    }

    this.clientId = this.$cookies.get('clientId');
    this.clientName = this.$cookies.get('clientName');
    this.assessmentId = this.$cookies.get('assessmentId');
    this.assessmentName = this.$cookies.get('assessmentName');
    this.idCopies = [], this.currentId = '';
    this.formIndex = 0, this.max = 0;
  }//End constructor

  $onInit() {
    this.newAssessment = {
      name: this.assessmentName,
      assessment: [{}]
    };
    
    this.$http.get('/api/users/assessment/' + this.userId + '/' + this.clientId + '/' + this.assessmentId)
    .then(response => {
      this.newAssessment.assessment = response.data.assessment;
      this.max = this.newAssessment.assessment.length;

      for (var i = 0; i < this.newAssessment.assessment.length; i++) {
        this.idCopies[i] = this.newAssessment.assessment[i]._id;
      }
      this.currentId = this.idCopies[0];
      this.dataLoaded = true;
    })
  }//End onInit

  saveAssessment() {
    this.$http.put('/api/users/assessmentUpdate/' + this.userId + '/' + this.clientId + '/' +
     this.assessmentId, this.newAssessment)
    .then(response => {
      this.$cookies.put('assessmentId', response.data._id);
      this.$cookies.put('assessmentName', response.data.name);
      this.$cookies.remove('templateId');
      this.$state.go('finishedAssessment');
    });
    // this.$window.location.href = '/clients';
  }//End saveAssessment

  incWeight(q) {
    if (q.weight <= 2)
      ++q.weight;
  }//End incWeight

  decWeight(q) {
    if (q.weight >= 1)
      --q.weight;
  }//End decWeight

  next() { 
    this.formIndex++;
    this.currentId = this.idCopies[this.formIndex];
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }//End next

  prev() { 
    this.formIndex--;
    this.currentId = this.idCopies[this.formIndex];
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }//End next

  checkMax() {
    if (this.formIndex >= this.max - 1) {
      return true;
    }   
    return false;
  }//End checkMax

  checkMin() {
    if (this.formIndex <= 0) {
      return true;
    }
    return false;
  }//End checkMin
}//End newAssessmentComponent