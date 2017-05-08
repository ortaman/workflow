
app.controller('LoginController', [
  '$scope','$state', '$http', '$window', 'AuthService', 'StorageService',
  function($scope, $state, $http, $window, AuthService, StorageService) {

    $scope.showAlert = false;

    $scope.loginSubmit = function(data) {

      AuthService.login(data)
        .then(function(response) {

          StorageService.set('token',response.data.token);
          $http.defaults.headers.common.Authorization = 'Token ' + StorageService.get('token');

          $state.go('coordinations');

        },function(errorResponse) {
          $scope.showAlert = true;

          if (errorResponse.data.non_field_errors) {
            $scope.error = "Nombre de usuario y/o contraseña inválidos.";
          }
          else {
            $scope.error = errorResponse.statusText || 'Request failed.';
          }

        });
    };

}]);
