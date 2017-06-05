
app.controller('ActionListController', ['$scope', 'ProducerGetListService','ProjectService',
 function($scope, ProducerGetListService, ProjectService) {

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
  	  		"project_id":$scope.selectedProject ,
  	  		"parent_action": "none",
  	  	};
        if($scope.selectedProject){
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
        }

    };

    $scope.onProjectSelect =  function (project) {
      $scope.selectedProject = project;
      $scope.producerPageChanged(project);

    }

    $scope.getProjects = function(){
      var query = {}
      ProjectService.getList(query).then(
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
