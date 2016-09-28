'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('forms', {
      url: '/forms',
      template: '<forms></forms>'
    })
    .state('single', {
    	url: '/forms/:_id',
    	template: require('./forms.single.html'),
    	controller: function($scope, $http, $stateParams) {
     		$scope._id = $stateParams._id, $scope.form = {}, $scope.newQ = {};

   		 	$http.get('/api/forms/' + $scope._id).then(response => {
      			$scope.form = response.data;
      			console.log($scope.form.name);
   		 	});//End get

   		 	$scope.toggleEdit = function(q) {
   		 		q.edit = !q.edit;
   		 	}//End toggleEdit

   		 	$scope.editForm = function(q) {
          $scope.form.grouping = $scope.form.name;
   		 		$http.put('/api/forms/' + $scope.form._id, $scope.form)
    			.success(function() {
      				q.edit = false;
    			})
    			.error(function(err) {
      				alert('An error occured while saving your changes. Please try again.');
   				});
   		 	}//End editForm

   		 	$scope.addQuestion = function() {
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
