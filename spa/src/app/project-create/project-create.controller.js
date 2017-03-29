
app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectCreateService',
  function($scope, $state, ProjectCreateService) {
    $scope.submitted = false;
    $scope.project = {};

    var transformFields = [
        'preparation_at',
        'negotiation_at',
        'execution_at',
        'evaluation_at',

        'accomplish_at', 
        'expire_at', 
        'renegotiation_at', 
        'report_at', 
        'begin_at',
    ];
      
    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        $scope.error = 'El formulario no es válido.';
        console.log($scope.projectForm);
        return;
      }

      var project = angular.copy($scope.project);

      angular.forEach(project, function(value, key) {
          transformFields.forEach(function(item) {
          
          if(key == item)
              project[key] = new moment(value).format("DD-MM-YYYY");
          })
      });

  		ProjectCreateService.create(project).then(
  			function(response) {
  				console.log('ProjectCreate', response);
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
