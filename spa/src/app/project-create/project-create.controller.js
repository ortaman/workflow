
app.controller('ProjectCreateController', [
  '$scope', '$state', 'ActionService', 'ProjectService', 'UserService','Notification',
  function($scope, $state, ActionService, ProjectService , UserService, Notification) {
    $scope.titles = {
      'project': {
        'type':'project',
        'create': 'Crear Proyecto',
        'nameOf': 'Nombre del proyecto',
        'rolesOf': 'Roles del Proyecto'
      },
      'action':{
        'type':'action',
        'create': 'Agregar acción a:',
        'nameOf': 'Nombre de la acción',
        'rolesOf': 'Roles de la acción'
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

    $scope.actionRelated  = true// TODO: por definir
    var Service = ProjectService;
    var type  = $state.params.parentProject ? 'action' : 'project' // TODO: por definir
    $scope.titles = $scope.titles[type];
    $scope.submitted = false; // TODO: cambiar  con  bandera de form
    $scope.project = {};

    $scope.init = function () {
      getProject()
      ////TODO cambiar
      UserService.me().then(function(response){
        $scope.project.client = response.id;
        $scope.client = response.name + " "+ response.first_surname + " " + response.second_surname;
      }, function(error){
        console.error("error",error);
      })
      //////////////////
    }

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

  		$scope.submmitPromise = Service.create(project).then(
  			function(response) {
          if (type != 'action') {
  				    Notification.success('La acción ha sido creado satisfactoriamente');
          }
          else{
            Notification.success('El proyecto ha sido creado satisfactoriamente');
          }
  				$state.go('coordinations');
  			},
  			function(errorResponse) {
          console.log('errorResponse', errorResponse);

  	  	}
  		);

    }

    var getProject = function () {
      if (type == 'action') {
        ActionService.getById($state.params.parentProject).then(
          function (response){
            $scope.projectParent = response;
            $scope.project.parent_action = $scope.projectParent.id;
            $scope.project.project = $scope.projectParent.parent_action == null ?  $scope.projectParent.id : $scope.projectParent.project.id;
            Service = ActionService;
          },
          function (error) {
            Notification.error("No existe un proyecto relacionado")
            console.error(error);
          }
        )
      }
    }

    $scope.updateLimitDates = function() {

      switch($scope.projectParent.phase) {
          case 'Preparación':
              $scope.minDate = new Date($scope.projectParent.project.begin_at);
              $scope.maxDate = new Date($scope.projectParent.project.preparation_at);
              break;
          case 'Negociación':
              $scope.maxDate = new Date($scope.projectParent.project.negotiation_at);
              $scope.minDate = new Date($scope.projectParent.project.preparation_at);
              break;
          case 'Ejecución':
              $scope.maxDate = new Date($scope.projectParent.project.ejecution_at);
              $scope.minDate = new Date($scope.projectParent.project.negotiation_at);
              break;
          default:
              $scope.maxDate = new Date($scope.projectParent.project.evaluation_at);
              $scope.minDate = new Date($scope.projectParent.project.ejecution_at);
      }

    };

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

    $scope.isProject = function () {
      if ($scope.titles.type == 'project') {
        return true;
      }
      return false;
    }
}]);
