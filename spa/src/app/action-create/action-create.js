
app.controller('ActionCreateController',
  ['$scope', 'ProjectListService', 'ActionCreateService',
    function($scope, ProjectListService, ActionCreateService) {

  $scope.projectList =[];

  $scope.getProjectList = function(){
    var query = {"page": "1"};
    ProjectListService.getList(query).then(
      function(data) {
        $scope.projectList = data.results;
      },
      function(error) {
      }
    );
  }

  $scope.submit = function (action) {
    action.accomplish_at = moment(action.accomplish_at).format("YYYY-MM-DD");
    action.expire_at = moment(action.expire_at).format("YYYY-MM-DD");
    action.renegotiation_at = moment(action.renegotiation_at).format("YYYY-MM-DD");
    action.report_at = moment(action.report_at).format("YYYY-MM-DD");
    action.begin_at = moment(action.begin_at).format("YYYY-MM-DD");


    ActionCreateService.create(action).then(
      function (data) {
        console.log("data", data);
      },
      function (data) {
        console.log("error", data.error);
      }
    );
  }

}]);
