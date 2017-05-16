
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
      var num = Math.round($scope.users.results.length / 4)
      return new Array(num);
    }
  }

  $scope.chunkArray = function(index) {
    if($scope.users.results)
      return $scope.users.results.slice(index*3, (index*3)+3);
  }
  ///////////////////////////end  of template interaction functions ///////////////////////////

}]);
