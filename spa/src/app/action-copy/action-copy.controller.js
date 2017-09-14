
app.controller('ActionCopyController', [
  '$scope', '$state', 'ActionService', 'ProjectService', 'UserService', 'Notification',
  function ($scope, $state, ActionService, ProjectService, UserService, Notification) {
    $scope.titles = {
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
    var type = $state.params.action ? 'action' : 'project';
    $scope.titles = $scope.titles[type];
    $scope.submitted = false; // TODO: cambiar  con  bandera de form
    $scope.datesValidations = {};
    $scope.project = {};

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

    /////////////////Services///////////////////////////////
    let getProject = function () {
      ActionService.getById($state.params.action).then(
        function (response) {
          $scope.project = response;
          Service = ActionService;
          UserService.me().then(user => {
            $scope.client = user.name + " " + user.first_surname + " " + user.second_surname;
            $scope.project.client = user.id;
          })
          $scope.datesValidations.accomplish_at = {
            min: (new moment($scope.project.begin_at)).toDate(),
            max: (new moment($scope.project.accomplish_at)).toDate(),            
          }

        },
        function (error) {
          Notification.error("No existe un proyecto relacionado")
          console.error(error);
        }
      )
    }

    ////////////////////dates validations///////////////////////

    $scope.getMinDate = function (date) {
      return new moment(date).format('DD-MM-YYYY');
    }

    var getMaxExecutionDate = function () {
      return moment($scope.projectParent[phases[$scope.projectParent.phase]]).toDate();
    }

    ////////////////////end dates validations///////////////////////
    var cleanDataForPost = function (project) {
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
