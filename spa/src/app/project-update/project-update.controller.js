
app.controller('ProjectUpdateController', [
  '$scope', '$state', 'ProjectService','APIConfig','Notification',
  function($scope, $state, ProjectService, APIConfig,Notification) {
    var type  =  'project';

    $scope.titles = {
      'project': {
        'type':'project',
        'name':  'Proyecto',
        'update':  'Actualizar Proyecto',
        'nameOf':  'Nombre del proyecto',
        'roles':  'Roles del Proyecto ',
      },
      'action':{
        'type':'action',
        'name':  'Acción',
        'update':  'Actualizar Acción',
        'nameOf':  'Nombre de la acción',
        'roles':  'Roles de la acción ',

      }
    }

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
      ProjectService.getById($state.params.id).then(
        function(response) {

          angular.forEach(response, function(value, key) {
              transformFields.forEach(function(item) {

              if(key == item) {
                var d = new Date(value);
                response[key] = new Date(d.getTime() + d.getTimezoneOffset() *60*1000);
              }

            })

          });
          response.image = APIConfig.baseUrl + response.image;// TODO: cambiar  imagen
          type  = response.parent_action == null ? 'project':'action'
          $scope.titles = $scope.titles[type];
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
        console.log($scope.projectForm);
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

  		$scope.submmitPromise = ProjectService.update($state.params.id, project).then(
  			function(response) {
          Notification.success('El proyecto ha sido actualizado');
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
    $scope.isProject = function(){
      if (type == 'project')
        return true;
      return false ;
    }
}]);
