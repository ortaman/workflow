
app.controller('ProjectListController', [
	'$scope', 'ProjectListService',
	function($scope, ProjectListService) {
  
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

	ProjectListService.getList().then(
		function(response) {
			$scope.data = response.results
			console.log('$scope.data', $scope.data);
		},
		function(errorResponse) {
			error = errorResponse || 'Request failed';
			console.log('errorResponse', error);
		}
	);

}]);
