
app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectCreateService',
  function($scope, $state, ProjectCreateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        $scope.error = 'El formulario no es válido.';
        console.log($scope.projectForm);
        return;
      }

      var project = angular.copy($scope.project);

      project.preparation_at = moment(project.preparation_at).format("DD-MM-YYYY");
    	project.negotiation_at = moment(project.negotiation_at).format("DD-MM-YYYY");
    	project.execution_at = moment(project.execution_at).format("DD-MM-YYYY");
    	project.evaluation_at = moment(project.evaluation_at).format("DD-MM-YYYY");
      
    	project.begin_at = moment(project.begin_at1).format("DD-MM-YYYY");
    	project.accomplish_at = moment(project.accomplish_at).format("DD-MM-YYYY");
    	project.renegotiation_at = moment(project.renegotiation_at).format("DD-MM-YYYY");
    	project.report_at = moment(project.report_at).format("DD-MM-YYYY");

  		ProjectCreateService.create(project).then(
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
