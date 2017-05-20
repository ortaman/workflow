
app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectCreateService','UserService','Notification',
  function($scope, $state, ProjectCreateService, UserService, Notification) {
    $scope.submitted = false;

    $scope.project = {};

    UserService.me().then(function(response){

      $scope.project.client = response.id;
      $scope.client = response.name + " "+ response.first_surname + " " + response.second_surname;
    }, function(error){
      console.error("error",error);
    })

    var transformFields = [
        'preparation_at',
        'negotiation_at',
        'execution_at',
        'evaluation_at',

        'accomplish_at',
        'renegotiation_at',
        'report_at',
        'begin_at',
    ];

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        Notification.error('El formulario contiene errores');
        return;
      }

      var project = angular.copy($scope.project);

      angular.forEach(project, function(value, key) {
          transformFields.forEach(function(item) {

          if(key == item)
              project[key] = new moment(value).format("YYYY-MM-DD");
          })
      });

  		$scope.submmitPromise = ProjectCreateService.create(project).then(
  			function(response) {
  				Notification.success('El proyecto ha sido creado satisfactoriamente');
  				$state.go('coordinations');
  			},
  			function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
  	  	}
  		);

    }

}]);
