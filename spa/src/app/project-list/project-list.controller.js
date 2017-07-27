
app.controller('ProjectListController', [
	'$scope', 'ProjectService', 'APIConfig','UserService',
	function($scope, ProjectService, APIConfig, UserService) {

	$scope.currentPage = 1;
	$scope.listForm = {
		level : 'time'
	}

	$scope.init = function () {
		UserService.me().then(
			function(response){
				$scope.user = response;
				$scope.pageChanged();
				$scope.getProjectStadistics();
			}
		)
	}
	$scope.pageChanged = function() {

		var query = {
			"page": $scope.currentPage,
		};

		if($scope.listForm.phase)
			query.phase = $scope.listForm.phase;

		ProjectService.getList(query).then(
			function(response) {
				$scope.data = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
	};

	$scope.getProjectStadistics = function () {
		ProjectService.getProjectStadistics().then(
			function (response) {
				$scope.stadistics = response
			}, function (errors) {
				console.error(errors);
			}
		)
	}

	$scope.onProjectSelect = function () {
		$scope.pageChanged()
	}

}]);
