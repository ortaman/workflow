
app.controller('ActionCreateController', [
  '$scope', '$state', 'ProjectListService', 'ActionCreateService', 'ProjectGetService',
  function($scope, $state, ProjectListService, ActionCreateService, ProjectGetService) {

  $scope.action = {};
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();
  $scope.actionId = $state.params.actionId.toString();

  $scope.init = function() {
    $scope.getProject();
  }

  $scope.submit = function (_action) {
    $scope.submitted = true;

    if ($scope.actionForm.$invalid) {
      $scope.error = 'El formulario no es válido.';
      console.log($scope.actionForm);
      return;
    }

    var action = angular.copy(_action);
    action.project = $scope.projectId;
    action.client = $scope.project.producer.id;
    if($scope.actionId)
      action.parent_action = $scope.actionId;

    ActionCreateService.create(action).then(
      function (response) {
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
    ProjectGetService.getById($state.params.projectId).then(
      function(response) {
        console.log('ProjectGet', response);
        $scope.project = response;

        $scope.action.project = $scope.project.name;
        $scope.action.client = $scope.project.producer.name + " "+ $scope.project.producer.first_surname + " " + $scope.project.producer.second_surname;
      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }
}]);
