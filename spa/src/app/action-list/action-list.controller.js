
app.controller('ActionListController', ['$scope', 'ActionListService', 'ProducerGetListService','ProjectListService',
 function($scope, ActionListService, ProducerGetListService, ProjectListService) {

   $scope.producersCurrentPage = 1;
   $scope.producers = []
   $scope.projects = [];

   $scope.init = function () {
     $scope.producerPageChanged();
     $scope.getProjects();
   }

  	$scope.producerPageChanged = function() {
        var query = {
          "page": $scope.producersCurrentPage,
  	  		"project_id":1,
  	  		"parent_action": "none",
  	  	};

  		ProducerGetListService.getList(query).then(
  			function(response) {

          console.log("respue", response);
          $scope.producers = response

  			},
  			function(errorResponse) {
  				$scope.status = errorResponse.statusText || 'Request failed';
  				$scope.errors = errorResponse.data;
  			}
  		);

    };

    $scope.onProjectSelect =  function (project) {
      console.log(project);
    }

    $scope.getProjects = function(){
      var query = {}
      ProjectListService.getList(query).then(
        function(response) {
           $scope.projects = response;
        },
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
      );
    }
}]);
