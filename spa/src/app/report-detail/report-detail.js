
app.controller('ReportDetailController', ['$scope', 'ReportGetService', '$state', function($scope, ReportGetService, $state) {
  console.log("detail", ReportGetService);

  $scope.report = {};
  
  $scope.init = function(){
    var reportId = $state.params.id
    $scope.getReport(reportId);
  }

  $scope.getReport = function (reportId){
    ReportGetService.getById(reportId).then(
      function(response){
        $scope.report = response
        console.log(response);
      }, function(errors){
        console.log(errors);
      });
  }
}]);
