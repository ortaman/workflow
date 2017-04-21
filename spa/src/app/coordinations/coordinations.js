
app.controller('CoordinationsController', ['$scope','ActionListService','UserService','ActionCreateService',
  function($scope, ActionListService, UserService, ActionCreateService) {

  $scope.promises = [];
  $scope.user;
  $scope.init = function(){
    UserService.me().then(function(response){
      $scope.user = response.id
      $scope.getCordinations('producer','Creada' );
      $scope.getCordinations('client','Creada' );
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
    var response = confirm("¿Está seguro que quiere aceptar esta accion?");
    if(response == true){
      action.promise = type
      ActionCreateService.update(action.id,action).then(
        function (response) {
          $scope.getCordinations('producer','Creada' );
          $scope.getCordinations('client','Creada' );
        },
        function (errors) {
          console.log(errors);
        }
      )
    }
  }
}]);
