
app.controller('ReportModalController', [ '$uibModalInstance','$state', 'ReportCreateService', '$scope','$rootScope',
 function($uibModalInstance, $state, ReportCreateService, $scope, $rootScope) {
    console.log($rootScope);
    $scope = this
    $scope.report = {
      'project':$state.params.id
    }

    $scope.sendReport = function(){
      console.log("repos", $scope);

      ReportCreateService.create($scope.report).then(
        function (response) {
          console.log("response", response);
        },
        function (errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
      );

    }
}]);
