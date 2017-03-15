
app.controller('LoginController', ['$scope','$state', '$http', 'AuthService', function($scope, $state, $http, AuthService) {

  $scope.showAlert = false;
  $scope.errors

  $scope.loginSubmit = function(data){
    $scope.getPosts = function() {
    AuthService.login(data)
      .then(function(data) {
        console.log(data);
        //guardar token
        $state.go('coordinatiosns')
      },function(error){
        $scope.errors = error.data;
        $scope.showAlert = true;

      });
  };

    $scope.getPosts();
  }
}]);




app.directive('loader', [

  function buttonLoader() {
    var directive = {
      restrict: 'A',
      scope: {
          loader: '='
      },
      link: linkFn,
    };

    return directive;

    function linkFn(scope, element, attrs) {
    }
  }

]);
