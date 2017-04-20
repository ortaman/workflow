
app.controller('ActionListController', ['$scope', 'ActionListService', 'ProducerGetListService',
 function($scope, ActionListService, ProducerGetListService) {

   $scope.producersCurrentPage = 1;

   $scope.init = function () {
     //$scope.producerPageChanged();

   }


    $scope.actions = [
      {
        "producer":{
          'name':"jankl",
          "first_surname":"valdes",
          "position":"empleado"
        },
        'promise':{
          "kept_percent": 1,
          "kept": 2,
          "empty": 3,
          "negotiating": 4,
          "open": 5,
        }
      }
    ]


  	$scope.producerPageChanged = function() {

  	  	var query = {
  	  		"page": $scope.producersCurrentPage,
  	  	};

  		ProducerGetListService.getList(query).then(
  			function(response) {

          console.log("respue", response);

  			},
  			function(errorResponse) {
  				$scope.status = errorResponse.statusText || 'Request failed';
  				$scope.errors = errorResponse.data;
  			}
  		);

    };

}]);
