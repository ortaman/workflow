
app.controller('ProjectListController', ['$scope', function($scope) {
  
  console.log('ProjectListController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);
