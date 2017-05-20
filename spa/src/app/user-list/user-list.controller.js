
app.controller('UserListController', [ '$state', 'UserService', '$scope',
 function( $state, UserService, $scope) {

   $scope.users = {}

   UserService.getList({}).then(
     function (response) {
       $scope.users = response;

     }
  )
///////////////////////////template interaction functions ///////////////////////////
  $scope.getRowNumber = function() {
    if($scope.users.results){
      var num = Math.ceil($scope.users.results.length / 4)
      return new Array(num);
    }
  }

  $scope.chunkArray = function(index) {
    if($scope.users.results)
      return $scope.users.results.slice(index*4, (index*4)+4);
  }
  ///////////////////////////end  of template interaction functions ///////////////////////////

}]);
