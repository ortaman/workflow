
app.controller('CoordinationsController', ['$scope','ActionListService','UserService','ActionCreateService','$mdDialog','APIConfig',
  function($scope, ActionListService, UserService, ActionCreateService, $mdDialog, APIConfig) {

  $scope.promisesCurrentPage = 1
  $scope.ordersCurrentPage = 1

  $scope.producerFiltertype;
  $scope.clientFiltertype;

  $scope.promises = [];
  $scope.user;
  $scope.init = function(){
    UserService.me().then(function(response){
      $scope.user = response.id
      $scope.getClients('Creada' , 'promise');
      $scope.getProducers('Creada', 'promise' );
    }, function(error){
      console.log("error",error);
    })
  }

  $scope.getClients = function(status, typeOfFilter, page=1){
    var query = {
      page:page
    };
    query[typeOfFilter] = status;
    $scope.clientFiltertype = typeOfFilter;

    $scope.clientStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    ActionListService.getList(query).then(
      function(response) {
          $scope.promises = response;
          $scope.getPhoto($scope.promises.results)
      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.getProducers = function(status, typeOfFilter, page=1){
    var query = {
      page:page
    };
    query[typeOfFilter] = status;
    $scope.producerFiltertype = typeOfFilter;

    $scope.producerStatus = status // status for display button according the promise
    console.log("aaaa",$scope.producerStatus);
    query.client = $scope.user; // id usuario

    ActionListService.getList(query).then(
      function(response) {
          $scope.orders = response;
          $scope.getPhoto($scope.orders.results)
      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.makeClientAction = function(action,type){
    var actionType = {
      'Aceptada':'aceptar',
      'Cumplida':'terminar',
    }

    var response = confirm("¿Está seguro que quiere "+ actionType[type]+" esta accion?");
    if(response == true){
      action.promise = type
      ActionCreateService.update(action.id,action).then(
        function (response) {
          $scope.getClients($scope.clientStatus, 'promise');
        },
        function (errors) {
          console.log(errors);
        }
      )
    }
  }

  $scope.makeProducerAction = function(action,type){
    console.log("tipo", type);
    var actionType = {
      'Satisfactoria':'satisfactoria',
      'Insatisfactoria':'insatisfactoria',
    }

    var response = confirm("¿Está seguro que quiere calificar esta cción como "+ actionType[type]+" ?");
    if(response == true){
      action.status = type
      ActionCreateService.update(action.id,action).then(
        function (response) {
          $scope.getProducers($scope.producerStatus, 'promise');
        },
        function (errors) {
          console.log(errors);
        }
      )
    }
  }

  $scope.makeClientAction = function(action,type){
    var actionType = {
      'Aceptada':'aceptar',
      'Cumplida':'terminar',
    }

    var response = confirm("¿Está seguro que quiere "+ actionType[type]+" esta accion?");
    if(response == true){
      action.promise = type
      ActionCreateService.update(action.id,action).then(
        function (response) {
          $scope.getClients($scope.clientStatus, 'promise');
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

  $scope.producerPageChanged = function () {
    $scope.producerStatus
    $scope.promisesCurrentPage = 1

  }

  $scope.getPhoto = function (obj) {
    angular.forEach(obj, function(item){
      item.project.image =  angular.copy(APIConfig.baseUrl+ item.project.image)
      item.producer.photo =  angular.copy(APIConfig.baseUrl+ item.producer.photo)
      item.client.photo =  angular.copy(APIConfig.baseUrl+ item.client.photo)
    })
  }
}]);
