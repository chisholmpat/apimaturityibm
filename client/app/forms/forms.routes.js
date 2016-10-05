'use strict';
// require('./forms.component.js');

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('forms', {
      url: '/forms',
      template: '<forms></forms>'
    })
    .state('forms.single', {
    	url: '/:_id',
    	template: require('./forms.single.html'),
    	controller: function($scope, $http, $stateParams) {
     		$scope._id = $stateParams._id, $scope.form = {}, $scope.newQ = {};

        $http.get('/api/users/me').then(response => {
          $scope.user = response;
          var i = 0, a = 0, f = 0, q = 0;
          $scope.clients = [], $scope.assessments = [], $scope.formsCopy = [];

          for (i; i < $scope.user.data.clients.length; i++) {
            $scope.clients[i] = $scope.user.data.clients[i];
            for (a; a < $scope.user.data.clients[i].assessments.length; a++) {
              $scope.assessments[a] = $scope.user.data.clients[i].assessments[a];
              for (f; f < $scope.user.data.clients[i].assessments[a].assessment.length; f++) {
                $scope.formsCopy[f] = $scope.user.data.clients[i].assessments[a].assessment[f];
                }
              }
            }
            
            i = 0;
            console.log($scope.formsCopy);

            for (i; i < $scope.formsCopy.length; i++) {
              if ($scope.formsCopy[i]._id === $scope._id) {
                $scope.form = $scope.formsCopy[i];
              }
            }
        });//End get me


   		 	$http.get('/api/forms/' + $scope._id).then(response => {
      			$scope.form = response.data;
      			console.log($scope.form.name);
   		 	});//End get

   		 	$scope.toggleEdit = function(q) {
   		 		q.edit = !q.edit;
   		 	}//End toggleEdit

   		 	$scope.updateForm = function(q) {
          $scope.form.grouping = $scope.form.name;
   		 		$http.put('/api/forms/' + $scope.form._id, $scope.form)
    			.success(function() {
      				q.edit = false;
    			})
    			.error(function(err) {
      				alert('An error occured while saving your changes. Please try again.');
   				});
   		 	}//End editForm

   		 	$scope.saveQuestion = function() {
   		 		if ($scope.newQ.category === 'Self Assessment')
   		 			$scope.newQ.answerArray = ['1','2','3', '4'];
   		 		else 
   		 			$scope.newQ.answerArray = ['1','2','3', '4', '5'];

          $scope.form.grouping = $scope.form.name;
   		 		$scope.cList = $scope.form.questions;
   		 		$scope.nList = $scope.cList.concat($scope.newQ);
   		 		$scope.form.questions = $scope.nList;

   		 		$http.put('/api/forms/' + $scope.form._id, $scope.form)
   		 		.then(response => {
				      $scope.form = response.data;
				})//End put
   		 	}//End addQuestion

   		 	$scope.deleteQuestion = function (question, q) {
   		 		$scope.form.questions.splice(question, 1);
   		 		$http.put('/api/forms/' + $scope.form._id, $scope.form)
   		 		.then(response => {
				      $scope.form = response.data;
				})//End put
   		 	}//End deleteQuestion
 		}//End controller
  });//End routes
}//End inject
