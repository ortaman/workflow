
app.controller('ActionCreateController', [
  '$scope', '$state', 'ProjectService', 'ActionCreateService', 'ActionGetService','Notification',
  function($scope, $state, ProjectService, ActionCreateService, ActionGetService, Notification) {

  $scope.action = {};
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();
  $scope.actionId = $state.params.actionId.toString();

  $scope.updateDates = function() {

    switch($scope.action.phase) {
        case 'Preparación':
            $scope.minDate = new Date($scope.project.begin_at);
            $scope.maxDate = new Date($scope.project.preparation_at);
            break;
        case 'Negociación':
            $scope.maxDate = new Date($scope.project.negotiation_at);
            $scope.minDate = new Date($scope.project.preparation_at);
            break;
        case 'Ejecución':
            $scope.maxDate = new Date($scope.project.ejecution_at);
            $scope.minDate = new Date($scope.project.negotiation_at);
            break;
        default:
            $scope.maxDate = new Date($scope.project.evaluation_at);
            $scope.minDate = new Date($scope.project.ejecution_at);
    }

  };

  $scope.init = function() {
    $scope.getProject();
    if($scope.actionId)
      $scope.getParentAction($scope.actionId);
  }

  $scope.submit = function (_action) {
    $scope.submitted = true;

    if ($scope.actionForm.$invalid) {
      Notification.error('El formulario contiene errores');
      console.log($scope.actionForm);
      return;
    }

    var action = angular.copy(_action);
    action.project = $scope.projectId;
    action.client = $scope.project.producer.id;
    if($scope.actionId)
      action.parent_action = $scope.actionId;

    $scope.submmitPromise = ActionCreateService.create(action).then(
      function (response) {
        Notification.success('La accion ha sido creada satisfactoriamente');

        if($scope.actionId)
          $state.go('actionDetail', {id:$scope.actionId})
        else
          $state.go('projectDetail', {id:$scope.project.id})
      },
      function (errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );

  }


  $scope.getProject = function(){
    ProjectService.getById($state.params.projectId).then(
      function(response) {
        console.log('ProjectGet', response);
        $scope.project = response;

        $scope.action.project = $scope.project.name;
        $scope.action.client = $scope.project.producer.name + " "+ $scope.project.producer.first_surname + " " + $scope.project.producer.second_surname;
        $scope.action.phase = $scope.project.phase;
        $scope.updateDates();
      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.getParentAction = function(id){
    ActionGetService.getById(id).then(
      function(response) {

        $scope.action.parent_action = response;
        console.log('actiontGet', $scope.action);

      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }
}]);
