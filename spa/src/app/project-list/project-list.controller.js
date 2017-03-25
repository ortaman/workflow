
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
				console.log('response', $scope.data);
			},
			function(errorResponse) {
				console.log('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

	};

	$scope.pageChanged()

}]);
