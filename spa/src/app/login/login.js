
app.controller('LoginController', ['$scope', function($scope) {
   
  console.log('LoginController');

  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);
