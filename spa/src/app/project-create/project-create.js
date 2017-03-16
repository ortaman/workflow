
app.controller('ProjectCreateController', ['$scope', function($scope) {

  var submited = false;

  $scope.submit = function(data) {
    console.log(data);
    submited = true;
  }

}]);
