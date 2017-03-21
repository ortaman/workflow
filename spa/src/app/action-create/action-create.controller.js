
app.controller('ActionCreateController', [
  '$scope', 'ProjectListService', 'ActionCreateService', '$state',
  function($scope, ProjectListService, ActionCreateService, $state) {

  $scope.projectList =[];
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();

  console.log($scope.projectId);

  $scope.getProjectList = function() {
    var query = {"page": "1"};
    ProjectListService.getList(query).then(
      function(data) {
        $scope.projectList = data.results;
      },
      function(error) {
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
        console.log("data", data);
        $state.go('actionList')

      },
      function (data) {
        console.log("error", data.error);
      }
    );
  }

}]);
