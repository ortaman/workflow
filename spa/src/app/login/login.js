
app.controller('LoginController', ['$scope','$state', '$http', 'AuthService', function($scope, $state, $http, AuthService) {

  $scope.showAlert = false;


  $scope.loginSubmit = function(data){
    AuthService.login(data);
    $state.go('coordinations')
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
