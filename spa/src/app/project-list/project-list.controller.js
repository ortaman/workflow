
app.controller('ProjectListController', [
	'$scope', 'ProjectListService', 'APIConfig',
	function($scope, ProjectListService, APIConfig) {

	$scope.currentPage = 1;
	$scope.listForm = {
		phase : 'Preparación',
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
				 response.results[i].color = $scope.getColor(response.results[i]);
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

	$scope.getColor = function (project) {
			console.log(project);
			if(moment(project.report_at).isBefore(moment()) && project.report == 0)
				return 'yellow-status-opacity'

			if(moment(project.report_at).isAfter(moment()) && project.report == 0)
				return 'red-status-opacity'

		return 'green-status-opacity'
	}
}]);
