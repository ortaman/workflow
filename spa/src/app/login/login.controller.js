
app.controller('LoginController', [
  '$scope', '$state', '$http', '$window', 'AuthService', 'StorageService',
  function ($scope, $state, $http, $window, AuthService, StorageService) {


    $scope.loginSubmit = function (data) {

      AuthService.login(data)
        .then(function (response) {

          StorageService.set('token', response.data.token);
          $http.defaults.headers.common.Authorization = 'Token ' + StorageService.get('token');
          $state.go('coordinations');

        })
        .catch(error => {
          if (error.data.non_field_errors) {
            $scope.errors = error.data.non_field_errors;
          }
          else {
            $scope.error = error.statusText || 'Request failed.';
          }
        })
    };

  }]);
