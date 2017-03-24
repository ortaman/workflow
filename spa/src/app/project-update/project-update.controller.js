
app.controller('ProjectUpdateController', [
  '$scope', '$state', 'ProjectGetService', 'ProjectUpdateService', 
  function($scope, $state, ProjectGetService, ProjectUpdateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.getProjectByIdInit = function() {
      ProjectGetService.getById($state.params.id).then(
        function(response) {
          console.log('getById', response);
          $scope.project = response;

          $scope.project.preparation_at1 = new Date($scope.project.preparation_at);
          $scope.project.negotiation_at1 = new Date($scope.project.negotiation_at);
          $scope.project.execution_at1 = new Date($scope.project.execution_at);
          $scope.project.evaluation_at1 = new Date($scope.project.evaluation_at);
          $scope.project.begin_at1 = new Date($scope.project.begin_at);
          $scope.project.accomplish_at1 = new Date($scope.project.accomplish_at);
          $scope.project.renegotiation_at1 = new Date($scope.project.renegotiation_at);
          $scope.project.report_at1 = new Date($scope.project.report_at);

        },
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          var status = errorResponse.statusText || 'Request failed';
          var errors = errorResponse.data;
        }
      );
    }

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        $scope.error = 'El formulario no es válido o no ha sido modificado.';
        console.log($scope.projectForm);
        return;
      }

      console.log('$scope.project', $scope.project);
      $scope.project.preparation_at = moment($scope.project.preparation_at1).format("DD-MM-YYYY");
    	$scope.project.negotiation_at = moment($scope.project.negotiation_at1).format("DD-MM-YYYY");
    	$scope.project.execution_at = moment($scope.project.execution_at1).format("DD-MM-YYYY");
    	$scope.project.evaluation_at = moment($scope.project.evaluation_at1).format("DD-MM-YYYY");
    	$scope.project.begin_at = moment($scope.project.begin_at1).format("DD-MM-YYYY");
    	$scope.project.accomplish_at = moment($scope.project.accomplish_at1).format("DD-MM-YYYY");
    	$scope.project.renegotiation_at = moment($scope.project.renegotiation_at1).format("DD-MM-YYYY");
    	$scope.project.report_at = moment($scope.project.report_at1).format("DD-MM-YYYY");

  		ProjectUpdateService.update($state.params.id, $scope.project).then(
  			function(response) {
  				console.log('reponse', response);
  				$state.go('projectList');
  			},
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
  		);
    
    }

}]);
