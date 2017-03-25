
app.controller('ActionCreateController', [
  '$scope', 'ProjectListService', 'ActionCreateService', '$state', 'ProjectGetService',
  function($scope, ProjectListService, ActionCreateService, $state, ProjectGetService) {

  $scope.action ={};
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();

  $scope.getProjectByIdInit = function() {
    ProjectGetService.getById($state.params.projectId).then(
      function(response) {
        $scope.project = response;
        $scope.action.project = $scope.project.id;
      },
      function(errorResponse) {
        var error = errorResponse || 'Request failed';
          console.log('error', error);
        }
    );
  }

  $scope.submit = function (_action) {
    $scope.submitted = true;
    var action = angular.copy(_action);
    ActionCreateService.create(action).then(
      function (data) {
        $state.go('projectDetail', {id:$scope.project.id})
      },
      function (data) {
        console.log("error", data.error);
      }
    );
  }

}]);
