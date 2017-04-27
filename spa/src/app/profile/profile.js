
app.controller('ProfileController', ['$scope','ProducerGetListService','UserService', function($scope, ProducerGetListService, UserService) {

  $scope.producersCurrentPage = 1;
  $scope.clientsCurrentPage = 1;

  $scope.producer = [];
  $scope.client = [];

  $scope.init = function(){
    UserService.me().then(
      function(response){
        $scope.user = response;
        $scope.performancePageChanged($scope.clientsCurrentPage, 'client');
        $scope.performancePageChanged($scope.producersCurrentPage, 'producer');
      }
    )
  }

  $scope.performancePageChanged = function(page, list) {
  	var query = {
  		"page": page,
  	};
    query[list] = $scope.user


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
