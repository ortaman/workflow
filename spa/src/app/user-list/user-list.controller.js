
app.controller('UserListController', [ '$state', 'UserService', '$scope',
 function( $state, UserService, $scope) {
   $scope.currentPage = 1 ;
   $scope.users = {}
   $scope.tempUserArray = {}

   $scope.init = function () {
     $scope.getUsers()
     UserService.me().then(function(response){
       $scope.myUser = response;
     }, function(error){
       console.error("error",error);
     })
   }

///////////////////////////calling service functions ///////////////////////////
  $scope.getUsers = function () {
    var query = {
      'page': $scope.currentPage,
    }
    UserService.getList(query).then(
      function (response) {
        console.log(response,"response");
        $scope.tempUserArray.paginated_by = response.paginated_by;
        $scope.tempUserArray.count = response.count;
        console.log($scope.tempUserArray, "cuenta");
        $scope.users = response;
      }
    )
  }

///////////////////////////end calling service functions ///////////////////////////

///////////////////////////template interaction functions ///////////////////////////
  $scope.getRowNumber = function() {
    if($scope.users.results){
      var num = Math.ceil($scope.users.results.length / 4)
      return new Array(num);
    }
  }

  $scope.chunkArray = function(index) {
      if($scope.users.results){
        return $scope.users.results.slice(index*4, (index*4)+4);;
      }
  }
  ///////////////////////////end  of template interaction functions ///////////////////////////

}]);
