
app.controller('CoordinationsController', ['$scope','ActionListService','UserService', function($scope, ActionListService, UserService) {

  $scope.promises = [];
  $scope.user;
  $scope.init = function(){
    UserService.me().then(function(response){
      $scope.user = response.id
      $scope.getCordinations('producer','created' );
      $scope.getCordinations('client','created' );
    }, function(error){
      console.log("error",error);
    })
  }

  $scope.getCordinations = function(userType, status){

    var query = {
      "promise": status,
    };

    if(userType == 'producer'){
      query.producer = $scope.user; // id usuario
      delete(query.client);
    }

    else if (userType == 'client'){
      query.client = $scope.user; // id usuario
      delete(query.producer);
    }

    ActionListService.getList(query).then(
      function(response) {
        if(userType == 'producer')
          $scope.promises = response.results;
        else if ( userType == 'client')
          $scope.orders = response.results;

      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.makeAction = function(action,type){
    console.log(action, type);
    if(type == 'retry'){

    }
    else{

    }
  }
}]);
