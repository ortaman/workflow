
app.controller('UserCreateController', [ '$state', 'UserService', '$scope',
 function( $state, UserService, $scope) {
   $scope.user = {}


   $scope.submit = function (user) {
     console.log(user);

     UserService.create(user).then(
       function (response) {
         console.log(response);
       },
       function(error){
         console.error(error);
       }
     )
   }
}]);
