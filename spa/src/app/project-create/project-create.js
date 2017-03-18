
app.controller('ProjectCreateController', ['$scope', 'ProjectService', function($scope, ProjectService) {

  var submited = false;

  $scope.submit = function(data) {
    console.log("datos enviar",data);
    submited = true;
    ProjectService.create(data).then(
      function(result){
        console.log(result);
      },
      function(result){
        console.log(result);
      }
    )
  }

}]);
