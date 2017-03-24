
app.controller('ProjectListController', [
	'$scope', 'ProjectListService', 'APIConfig',
	function($scope, ProjectListService, APIConfig) {

	$scope.currentPage = 1;
	$scope.baseUrl = APIConfig.baseUrl;

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
