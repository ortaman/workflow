
app.controller('ProfileController', ['$scope','ProducerGetListService','UserService', function($scope, ProducerGetListService, UserService) {

  $scope.producersCurrentPage = 1;
  $scope.clientsCurrentPage = 1;
  $scope.producers = [];
  $scope.clients = [];

  $scope.init = function(){
    //$scope.producerPageChanged(clientsCurrentPage, 'clients');
    //$scope.producerPageChanged(producersCurrentPage, 'producers');
    UserService.me().then(
      function(response){
        $scope.user = response;
        console.log(response);
      }
    )
  }

  $scope.producerPageChanged = function(page, list) {
	  	var query = {
	  		"page": page,
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
	  	};

		ProducerGetListService.getList(query).then(
			function(response) {

				for (var i=0; i < response.producers.length; i++) {
					response.producers[i].producer.photo = APIConfig.baseUrl + response.producers[i].producer.photo;
				}
				$scope[list] = response;
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  };

}]);
