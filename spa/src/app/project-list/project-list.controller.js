
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
			"client":$scope.user.id
		};

		ProjectListService.getList(query).then(
			function(response) {
				for (var i=0; i < response.results.length; i++) {
				 response.results[i].color = $scope.getColor(response.results[i]);
				}

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
				console.log(response);
				//$scope.stadistics = response


			}, function (errors) {
				$scope.stadistics = {
					'inTime':9,
					'delayed':2,
					'inRisk':23
				}
				console.error(errors);
			}
		)
	}

	$scope.onProjectSelect = function () {
		$scope.pageChanged()
	}

	$scope.getColor = function (project) {
			if(moment(project.report_at).isBefore(moment()) && project.report == 0)
				return 'red-status-opacity'

			if(moment(project.report_at).isAfter(moment()) && project.report == 0)
				return 'yellow-status-opacity'

		return 'green-status-opacity'
	}
}]);
