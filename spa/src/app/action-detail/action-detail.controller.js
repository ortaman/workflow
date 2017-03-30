
app.controller('ActionDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 
	'ProducerGetListService', 'ActionGetService',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, 
		ProducerGetListService, ActionGetService) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;

	$scope.currentAction = {};
	$scope.project = {};
	$scope.producers = [];

  	$scope.init = function() {
		$scope.getAction();
		//$scope.actionPageChanged()
		//$scope.producerPageChanged();
	}

	//Service call

	$scope.getAction = function() {
		ActionGetService.getById($state.params.id).then(
			function(response) {
				$scope.currentAction = response;
				$scope.currentAction.producer.photo = APIConfig.baseUrl + response.producer.photo;
				$scope.currentAction.project.image = APIConfig.baseUrl + response.project.image;
				console.log("imagen", response);
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
				$scope.actions = response;
				console.log("actions", response);
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

				for (var i=0; i < $scope.producers.results.length; i++) {
					console.log($scope.producers.results[i].photo);
					$scope.producers.results[i].photo = APIConfig.baseUrl + $scope.producers.results[i].photo.substring(32);
				}

				console.log("producers", response);
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
