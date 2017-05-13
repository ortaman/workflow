
app.controller('ProjectUpdateController', [
  '$scope', '$state', 'ProjectGetService', 'ProjectUpdateService','APIConfig',
  function($scope, $state, ProjectGetService, ProjectUpdateService, APIConfig) {
    $scope.submitted = false;
    $scope.project = {};

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

    $scope.getProjectByIdInit = function() {
      ProjectGetService.getById($state.params.id).then(
        function(response) {
          console.log('getById', response);

          angular.forEach(response, function(value, key) {
              transformFields.forEach(function(item) {

              if(key == item) {
                var d = new Date(value);
                response[key] = new Date(d.getTime() + d.getTimezoneOffset() *60*1000);
              }

            })

          });
          response.image = APIConfig.baseUrl + response.image;
          $scope.project = response;
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

      var project = angular.copy($scope.project);

      angular.forEach(project, function(value, key) {
          transformFields.forEach(function(item) {

          if(key == item)
              project[key] = new moment(value).format("YYYY-MM-DD");
          })

      });

  		$scope.submmitPromise = ProjectUpdateService.update($state.params.id, project).then(
  			function(response) {
  				console.log('ProjectUpdate', response);
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
