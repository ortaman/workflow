
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
	$scope.getProject = function(){
		ProjectGetService.getById($state.params.id).then(
				function(response) {
					$scope.project = response;
					$scope.project.image = APIConfig.baseUrl + response.image;
					$scope.project.producer.photo = APIConfig.baseUrl + response.producer.photo;
				},
			function(errorResponse) {
					console.log('errorResponse', errorResponse);
					$scope.status = errorResponse.statusText || 'Request failed';
					$scope.errors = errorResponse.data;
				}
		);
	}

	$scope.actionPageChanged = function() {

	  var query = {"page": $scope.actionCurrentPage};
		ActionListService.getList(query).then(
			function(response) {
				$scope.actions = response
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
				$scope.producers = response
				console.log("respuesta", response);
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
			return $scope.producers.slice(index*3, (index*3)+3);
	}

}]);
