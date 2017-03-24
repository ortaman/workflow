
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
    action.accomplish_at = moment(action.accomplish_at).format("DD-MM-YYYY");
    action.expire_at = moment(action.expire_at).format("DD-MM-YYYY");
    action.renegotiation_at = moment(action.renegotiation_at).format("DD-MM-YYYY");
    action.report_at = moment(action.report_at).format("DD-MM-YYYY");
    action.begin_at = moment(action.begin_at).format("DD-MM-YYYY");

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
