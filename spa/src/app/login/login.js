
app.controller('LoginController', ['$scope','$state', '$http', 'AuthService', '$window', function($scope, $state, $http, AuthService, $window) {

  $scope.showAlert = false;
  $scope.errors

  $scope.loginSubmit = function(data){
    $scope.getPosts = function() {
    AuthService.login(data)
      .then(function(data) {
        $window.localStorage.setItem("token",data.token);
        $state.go('coordinations')
      },function(error){
        $scope.errors = error.data;
        $scope.showAlert = true;
      });
    };
    $scope.getPosts();

  }
}]);
