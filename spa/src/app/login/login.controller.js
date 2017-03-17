
app.controller('LoginController', [
  '$scope','$state', '$http', '$window', 'AuthService',  
  function($scope, $state, $http, $window, AuthService) {

    $scope.showAlert = false;

    $scope.loginSubmit = function(data) {

      AuthService.login(data)
        .then(function(response) {
          $window.localStorage.setItem("token", response.token);
          $state.go('coordinations');

        },function(errorResponse) {
          $scope.showAlert = true;

          if (errorResponse.data.non_field_errors) {
            $scope.errors = "Nombre de usuario y/o contraseña inválidos";
          }
          else {
            $scope.errors = errorResponse.statusText || 'Request failed';
          }

        });
    };

}]);
