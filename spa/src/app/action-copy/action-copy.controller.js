
app.controller('ActionCopyController', [
  '$scope', '$state', 'ActionService', 'ProjectService', 'UserService', 'Notification',
  function ($scope, $state, ActionService, ProjectService, UserService, Notification) {
    $scope.titles = {
      'project': {
        'type': 'project',
        'create': 'Crear Proyecto',
        'nameOf': 'Nombre del proyecto',
        'rolesOf': 'Roles del Proyecto'
      },
      'action': {
        'type': 'action',
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
    var type = $state.params.action ? 'action' : 'project' // TODO: por definir
    $scope.titles = $scope.titles[type];
    $scope.submitted = false; // TODO: cambiar  con  bandera de form
    $scope.project = {
    };

    $scope.init = function () {
      getProject()
    }

    $scope.submitForm = function () {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        Notification.error('El formulario contiene errores');
        return;
      }

      var project = angular.copy($scope.project);

      angular.forEach(project, function (value, key) {
        transformFields.forEach(function (item) {

          if (key == item)
            project[key] = new moment(value).format("YYYY-MM-DD");
        })
      });
      cleanDataForPost(project);
      $scope.submmitPromise = Service.create(project).then(
        function (response) {
          if (type == 'action') {
            Notification.success('La acción ha sido creada satisfactoriamente');
          }
          else {
            Notification.success('El proyecto ha sido creado satisfactoriamente');
          }
          $state.go('coordinations');
        },
        function (errorResponse) {
          console.log('errorResponse', errorResponse);

        }
      );

    }


    var getProject = function () {
      ActionService.getById($state.params.action).then(
        function (response) {
          $scope.project = response;
          Service = ActionService;
          $scope.client = response.client.name + " " + response.client.first_surname + " " + response.client.second_surname;
          $scope.project.client = response.client.id;
        },
        function (error) {
          Notification.error("No existe un proyecto relacionado")
          console.error(error);
        }
      )
    }
    ////////////////////dates validations///////////////////////

    $scope.beginOrAtOrAccomplishDateChanged = function (begin_at, accomplish_at) {
      // delete $scope.project.renegotiation_at
      // if (accomplish_at){
      //   var minDate = moment(begin_at).add(1, 'd');
      //   $scope.renegotiation_min_date = minDate.toDate();
      //   var maxDate = Math.ceil(moment(accomplish_at).diff(minDate, 'days')/ 2)
      //   $scope.renegotiation_max_date = moment(accomplish_at).subtract(maxDate, 'd').toDate();
      // }
    }

    var getMaxExecutionDate = function () {
      return moment($scope.projectParent[phases[$scope.projectParent.phase]]).toDate();
    }

    ////////////////////end dates validations///////////////////////

    $scope.isProject = function () {
      return $scope.titles.type == 'project';
    }

    var cleanDataForPost = function (project) {
      console.log(project);
      if (typeof (project.project) != Number)
        project.project = project.project.id;
      delete (project.created_at)
      delete (project.created_by)
      delete (project.id)
      delete (project.reports)
      delete (project.updated_at)
      delete (project.advance_report_at)
      delete (project.ejecution_report_at)
    }
  }]);
