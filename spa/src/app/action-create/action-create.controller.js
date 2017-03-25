
app.controller('ActionCreateController', [
  '$scope', 'ProjectListService', 'ActionCreateService', '$state', 'ProjectGetService',
  function($scope, ProjectListService, ActionCreateService, $state, ProjectGetService) {

  $scope.action ={};
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();

  $scope.getProjectByIdInit = function() {
    ProjectGetService.getById($state.params.projectId).then(
      function(response) {
        console.log('response', response);
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

  $scope.submit = function (_action) {
    $scope.submitted = true;

    if ($scope.actionForm.$invalid) {
      $scope.error = 'El formulario no es válido.';
      console.log($scope.actionForm);
      return;
    }

    var action = angular.copy(_action);
    ActionCreateService.create(action).then(
      function (response) {
        console.log("Create", response);
        $state.go('projectDetail', {id:$scope.project.id})
      },
      function (errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );

  }

}]);
