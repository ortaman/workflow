
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

    var phases = {
      'Preparación': 'preparation_at',
      'Negociación': 'negotiation_at',
      'Ejecución': 'execution_at',
      'Evaluación': 'evaluation_at',
    }

    var Service = ProjectService;
    var type  = $state.params.parentProject ? 'action' : 'project' // TODO: por definir
    $scope.titles = $scope.titles[type];
    $scope.submitted = false; // TODO: cambiar  con  bandera de form
    $scope.project = {
      'begin_at': moment().toDate()
    };

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
            if (!$scope.isProject()){
              $scope.maxExecutionDate = getMaxExecutionDate();
              $scope.maxBeginDate = getMaxBeginDate();
              $scope.getProjectParentBeginDate = moment($scope.projectParent.begin_at).toDate()

            }
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

    ////////////////////dates validations///////////////////////

    var getMaxExecutionDate = function () {
      if(!$scope.isProject())
        return moment($scope.projectParent[phases[$scope.projectParent.phase]]).toDate();
      return moment($scope.projectParent.accomplish_at).toDate();
    }

    var getMaxBeginDate = function () {
      if(!$scope.isProject())
        return moment($scope.projectParent[phases[$scope.projectParent.phase]]).toDate();
      return moment($scope.projectParent.accomplish_at).toDate();
    }

    $scope.$watch('project.accomplish_at', function(item){
      if (item) {
        let executionDate = moment(item);
        let beginDate = moment(angular.copy($scope.project.begin_at));
        var daysOfDiference = Math.round(executionDate.diff(moment($scope.project.begin_at), 'days'))
        console.log("diferencia ", daysOfDiference)

        $scope.validRange = {
          preparation_at : {},
          negotiation_at : {},
          execution_at : {},
          evaluation_at : {},
          renegotiation_at : {},
          report_at : {}
        };
        angular.forEach($scope.validRange, function ( value, key) {
          delete ($scope.project[key]);
        })
        $scope.project.preparation_at = angular.copy(beginDate).add(Math.round(daysOfDiference * .10), 'd').toDate();
        $scope.project.negotiation_at = angular.copy(beginDate).add(Math.round(daysOfDiference * .20), 'd').toDate();
        $scope.project.execution_at = angular.copy(executionDate).add(Math.round(daysOfDiference * 0), 'd').toDate();
        $scope.project.evaluation_at = angular.copy(executionDate).add(Math.round(daysOfDiference * .10), 'd').toDate();
        $scope.project.renegotiation_at =  angular.copy(beginDate).add(Math.round(daysOfDiference * .50), 'd').toDate();
        $scope.project.report_at = beginDate.add(Math.round(daysOfDiference * .50), 'd').toDate();

      }
    })
    ////////////////////end dates validations///////////////////////

    $scope.isProject = function () {
      return $scope.titles.type == 'project';
    }
}]);
