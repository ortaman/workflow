
app.controller('ProjectListController', [
	'$scope', 'ProjectListService', 'APIConfig',
	function($scope, ProjectListService, APIConfig) {

	$scope.currentPage = 1;
	$scope.listForm = {
		phase : 'Ejecución',
		level : 'time'
	}

	$scope.init = function () {
		$scope.pageChanged()
	}
	$scope.pageChanged = function() {

		var query = {
			"page": $scope.currentPage,
			"phase":$scope.listForm.phase
		};

		ProjectListService.getList(query).then(
			function(response) {
				console.log('ProjectList', response);
				for (var i=0; i < response.results.length; i++) {
				 response.results[i].image = APIConfig.baseUrl + response.results[i].image;
				}

				$scope.data = response
			},
			function(errorResponse) {
				console.log('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

	};

	$scope.onProjectSelect = function () {
		$scope.pageChanged()
	}
}]);
