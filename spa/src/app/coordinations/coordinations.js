
app.controller('CoordinationsController', ['$scope','ActionListService','UserService','$rootScope', function($scope, ActionListService, UserService, $rootScope) {

  $scope.promises = [];
  $scope.user;
  $scope.init = function(){


    $scope.user = $rootScope.getCurrentUser().id;
    $scope.getCordinations('producer','created' );
    $scope.getCordinations('client','created' );

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
        console.log("CoordinationsController", response);

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

}]);
