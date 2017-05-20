
app.controller('UserCreateController', [ '$state', 'UserService', '$scope', 'Notification',
 function( $state, UserService, $scope, Notification) {
   $scope.user = {}

   console.log($state);
   if($state.params.id){
     UserService.get($state.params.id).then(
       function (response) {
         console.log(response);
         $scope.user = response;
       }
     )
   }

   $scope.submit = function (user) {
     if(!$scope.userForm.$valid){
       Notification.error("El formulario no es valido");
       return
     }
     else if($scope.user.password != $scope.passwordConfirmation){
       Notification.error("La contraseña no coincide con la confirmación");
     }

     if(!$state.params.id){
       $scope.submmitPromise = UserService.create(user).then(
         function (response) {
           $state.go("userList")
         },
         function(errors){
           $scope.errors = errors.data
           angular.forEach($scope.errors, function (error) {
             angular.forEach(error, function (item) {
               Notification.error(item)
             })
           })
         }
       )
     }else{
       console.log("update");
       $scope.submmitPromise = UserService.update(user, user.id).then(
         function (response) {
           $state.go("userList")
         },
         function(error){
           console.error(error);
         }
       )
     }

   }
}]);
