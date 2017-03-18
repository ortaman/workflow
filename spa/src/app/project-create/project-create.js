
app.controller('ProjectCreateController', ['$scope', 'ProjectService','UserService' ,function($scope, ProjectService,UserService) {

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
