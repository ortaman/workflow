
app.controller('ProjectCreateController', [
  '$scope', 'ProjectCreateService',
  function($scope, ProjectCreateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.submitForm = function (){
      $scope.submitted = true;
    }

}]);
