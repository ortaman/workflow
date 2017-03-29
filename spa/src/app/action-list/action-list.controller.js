
app.controller('ActionListController', ['$scope', 'ActionListService', function($scope, ActionListService) {
  
  console.log('ActionListController');

	ActionListService.getList().then(
		function(response) {
			console.log('ActionList', response);
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
