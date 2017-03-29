
app.controller('ProjectUpdateController', [
  '$scope', '$state', 'ProjectGetService', 'ProjectUpdateService', 
  function($scope, $state, ProjectGetService, ProjectUpdateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.getProjectByIdInit = function() {
      ProjectGetService.getById($state.params.id).then(
        function(response) {
          response.preparation_at = new Date(response.preparation_at);
          response.negotiation_at = new Date(response.negotiation_at);
          response.execution_at = new Date(response.execution_at);
          response.evaluation_at = new Date(response.evaluation_at);
          response.begin_at = new Date(response.begin_at);
          response.accomplish_at = new Date(response.accomplish_at);
          response.renegotiation_at = new Date(response.renegotiation_at);
          response.report_at = new Date(response.report_at);

          $scope.project = response;
          console.log('getById', $scope.project);
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
        $scope.error = 'El formulario no es válido.';
        console.log($scope.projectForm);
        return;
      }

      var project =  angular.copy($scope.project);
      
      project.preparation_at = moment(project.preparation_at).format("DD-MM-YYYY");
    	project.negotiation_at = moment(project.negotiation_at).format("DD-MM-YYYY");
    	project.execution_at = moment(project.execution_at).format("DD-MM-YYYY");
    	project.evaluation_at = moment(project.evaluation_at).format("DD-MM-YYYY");
    	project.begin_at = moment(project.begin_at).format("DD-MM-YYYY");
    	project.accomplish_at = moment(project.accomplish_at).format("DD-MM-YYYY");
    	project.renegotiation_at = moment(project.renegotiation_at).format("DD-MM-YYYY");
    	project.report_at = moment(project.report_at).format("DD-MM-YYYY");

      console.log('project', project);

  		ProjectUpdateService.update($state.params.id, project).then(
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
