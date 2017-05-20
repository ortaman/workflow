
app.controller('ProjectListController', [
	'$scope', 'ProjectListService', 'APIConfig','UserService',
	function($scope, ProjectListService, APIConfig, UserService) {

	$scope.currentPage = 1;
	$scope.listForm = {
		phase : 'Preparación',
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
			"phase":$scope.listForm.phase,
		};

		ProjectListService.getList(query).then(
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
		ProjectListService.getProjectStadistics().then(
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
