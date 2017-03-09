
app.controller('HomeController', ['$scope', function($scope) {
  
  console.log('HomeController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);
