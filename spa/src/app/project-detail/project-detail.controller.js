
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;

	$scope.project = {};
	$scope.producers = [];

  	$scope.getProjectByIdInit = function() {
		$scope.getProject();
		$scope.actionPageChanged()
		$scope.producerPageChanged();
	}

	//Service call
	$scope.getProject = function() {
		ProjectGetService.getById($state.params.id).then(
			function(response) {
				console.log("ProjectGet", response);
				response.image = APIConfig.baseUrl + response.image;
				response.producer.photo = APIConfig.baseUrl + response.producer.photo;

				$scope.project = response;
			},
			function(errorResponse) {
				console.log('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
	}

	$scope.actionPageChanged = function() {

	  var query = {"page": $scope.actionsCurrentPage};
		ActionListService.getList(query).then(
			function(response) {
				console.log("ActionList", response);
				$scope.actions = response;
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	$scope.producerPageChanged = function() {

	    var query = {"page": $scope.producersCurrentPage};
		ProducerGetListService.getList(query).then(
			function(response) {
				console.log("ProducerGet", response);
				for (var i=0; i < response.results.length; i++) {
					console.log(response.results[i].photo);
					response.results[i].photo = APIConfig.baseUrl + response.results[i].photo.substring(32);
				}

				$scope.producers = response;
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	//template interaction functions
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index){
		if($scope.producers.results)
			return $scope.producers.results.slice(index*3, (index*3)+3);


	}

}]);
