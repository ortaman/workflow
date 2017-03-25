
app.controller('ActionListController', ['$scope', 'ActionListService', function($scope, ActionListService) {
  
  console.log('ActionListController');

	ActionListService.getList().then(
		function(response) {
			console.log('reponse', response);
		},
		function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
  		}
	);
 
  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);

/*
angular.module('myApp.actionList', ['ui.router']);

angular.module('myApp.actionList').config('$http', 'APIConfig', function($http, APIConfig) {

  // Now set up the states
  $stateProvider
    .state('actionList', {
      url: "/actionList",
      templateUrl: "app/action-list/action-list.html",
      controller: "ActionListController",
    })
});

app.module('myApp.actionList').service("ActionService", ['$http', function($http) {
	this.getList = function() {
	  var promise = $http.get(APIConfig.url + "api/actions/").then(function(response) {
	  return response.data;
	});
	  return promise;
	};
}]);

app.module('myApp.actionList').controller('ActionListController', ['URLTemplates','$scope', 'ActionService', function(URLTemplates,$scope, ActionService) {
  
  console.log('ActionListController');

	ActionService.getList().then(
		function(response) {
			console.log('reponse', response);
		},
		function(errorResponse) {
			  error = errorResponse || 'Request failed';
    		console.log('error', error);
  		}
	);
 
  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);
*/