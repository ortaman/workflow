
app.controller('UserCreateController', [ '$state', 'UserService', '$scope', 'Notification',
 function( $state, UserService, $scope, Notification) {
   $scope.user = {}


   $scope.submit = function (user) {
     if(!$scope.userForm.$valid){
       Notification.error("El formulario no es valido");
       return
     }
     else if($scope.user.password != $scope.passwordConfirmation){
       Notification.error("La contraseña no coincide con la confirmación");
     }
     $scope.submmitPromise = UserService.create(user).then(
       function (response) {
         $state.go("userList")
       },
       function(error){
         console.error(error);
       }
     )
   }
}]);
