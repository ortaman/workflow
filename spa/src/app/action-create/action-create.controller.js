
app.controller('ActionCreateController', [
  '$scope', '$state', 'ProjectListService', 'ActionCreateService', 'ProjectGetService',
  function($scope, $state, ProjectListService, ActionCreateService, ProjectGetService) {

  var project = {};

  $scope.action = {};
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();

  $scope.getProjectByIdInit = function() {
    ProjectGetService.getById($state.params.projectId).then(
      function(response) {
        console.log('ProjectGet', response);
        project = response;

        $scope.action.project = project.name;
        $scope.action.client = project.producer.name + " "+ project.producer.first_surname + " " + project.producer.second_surname;
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
    
    action.project = project.id;
    action.client = project.producer.id;

    ActionCreateService.create(action).then(
      function (response) {
        console.log("ActionCreate", response);
        $state.go('projectDetail', {id:project.id})
      },
      function (errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );

  }

}]);
