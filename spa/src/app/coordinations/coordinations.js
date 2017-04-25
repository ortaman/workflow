
app.controller('CoordinationsController', ['$scope','ActionListService','UserService','ActionCreateService','$mdDialog','APIConfig',
  function($scope, ActionListService, UserService, ActionCreateService, $mdDialog, APIConfig) {

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

  $scope.getCordinations = function(userType, status, typeOfFilter){

    var query = {};
    query[typeOfFilter] = status;

    if(userType == 'producer'){
      $scope.producerStatus = status
      query.producer = $scope.user; // id usuario
      delete(query.client);
    }

    else if (userType == 'client'){
      $scope.clientStatus = status
      query.client = $scope.user; // id usuario
      delete(query.producer);
    }

    ActionListService.getList(query).then(
      function(response) {
        if(userType == 'producer'){
          $scope.promises = response.results;
          $scope.getPhoto($scope.promises)
        }

        else if ( userType == 'client'){
          $scope.orders = response.results;
          $scope.getPhoto($scope.orders)
          }
      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.makeAction = function(action,type, currentTab, userType){

    var actionType = {
      'Aceptada':'aceptar',
      'Cumplida':'terminar',
    }

    var response = confirm("¿Está seguro que quiere "+ actionType[type]+" esta accion?");
    if(response == true){
      action.promise = type
      ActionCreateService.update(action.id,action).then(
        function (response) {
          $scope.getCordinations(userType,currentTab );
        },
        function (errors) {
          console.log(errors);
        }
      )
    }
  }


	$scope.openModal = function(action) {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'CoordinationsModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/coordinations/action-detail.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 currentAction: action
		 }
		}).finally(function() {

    });
	}

  $scope.getPhoto = function (obj) {
    angular.forEach(obj, function(item){
      item.project.image =  angular.copy(APIConfig.baseUrl+ item.project.image)
      item.producer.photo =  angular.copy(APIConfig.baseUrl+ item.producer.photo)
    })
  }
}]);
