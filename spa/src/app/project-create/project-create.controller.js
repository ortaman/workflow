
app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectService','UserService','Notification',
  function($scope, $state, ProjectService, UserService, Notification) {
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

  		$scope.submmitPromise = ProjectService.create(project).then(
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

    ////////////////////dates validations///////////////////////

    $scope.beginOrAtOrAccomplishDateChanged = function (begin_at, accomplish_at) {
      delete $scope.project.renegotiation_at
      if (begin_at, accomplish_at){
        var minDate = moment(begin_at).add(1, 'd');
        $scope.renegotiation_min_date = minDate.toDate();
        var maxDate = Math.ceil(moment(accomplish_at).diff(minDate, 'days')/ 2)
        $scope.renegotiation_max_date = moment(accomplish_at).subtract(maxDate, 'd').toDate();
      }
    }
    ////////////////////end dates validations///////////////////////

}]);
