
app.controller('ProjectListController', [
	'$scope', 'ProjectListService',
	function($scope, ProjectListService) {

	$scope.currentPage = 1;

  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

  $scope.pageChanged = function() {

	  var query = {"page": $scope.currentPage};

		ProjectListService.getList(query).then(
			function(response) {
				$scope.data = response
				console.log('$scope.data', $scope.data);
			},
			function(errorResponse) {
				error = errorResponse || 'Request failed';
				console.log('errorResponse', error);
			}
		);

  };

  $scope.pageChanged()

}]);
