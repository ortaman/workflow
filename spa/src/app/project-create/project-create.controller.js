
app.controller('ProjectCreateController', [
  '$scope',
  function($scope) {
    $scope.project = {};

    $scope.submitForm = function (){
      alert(JSON.stringify($scope.project));
    }
    
}]);
