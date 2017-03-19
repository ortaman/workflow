
app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectCreateService',
  function($scope, $state, ProjectCreateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.submitForm = function (){
      $scope.submitted = true;

        $scope.project.preparation_at = moment($scope.project.preparation_at1).format("DD-MM-YYYY");
      	$scope.project.negotiation_at = moment($scope.project.negotiation_at1).format("DD-MM-YYYY");
      	$scope.project.execution_at = moment($scope.project.execution_at1).format("DD-MM-YYYY");
      	$scope.project.evaluation_at = moment($scope.project.evaluation_at1).format("DD-MM-YYYY");
      	$scope.project.begin_at = moment($scope.project.begin_at1).format("DD-MM-YYYY");
      	$scope.project.accomplish_at = moment($scope.project.accomplish_at1).format("DD-MM-YYYY");
      	$scope.project.renegotiation_at = moment($scope.project.renegotiation_at1).format("DD-MM-YYYY");
      	$scope.project.report_at = moment($scope.project.report_at1).format("DD-MM-YYYY");

		ProjectCreateService.create($scope.project).then(
			function(response) {
				console.log('reponse', response);
				$state.go('projectList');
			},
			function(errorResponse) {
				var error = errorResponse || 'Request failed';
	    		console.log('error', error);
	  		}
		);
    
    }

}]);
