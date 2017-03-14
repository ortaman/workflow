
app.controller('ActionListController', ['$scope', function($scope) {
  
   console.log('ActionListController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);
