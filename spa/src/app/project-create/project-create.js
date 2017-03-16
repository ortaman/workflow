
app.controller('ProjectCreateController', ['$scope', function($scope) {

  console.log('ProjectCreateController');

   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

  $scope.submit = function(data) {
    console.log(data);
  }

}]);
