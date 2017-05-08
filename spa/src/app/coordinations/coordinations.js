
app.controller('CoordinationsController', ['$scope','ActionListService','UserService','ActionCreateService','$mdDialog',
  'APIConfig','ProjectListService','ProjectCreateService',
  function($scope, ActionListService, UserService, ActionCreateService, $mdDialog, APIConfig, ProjectListService, ProjectCreateService) {

  $scope.promisesCurrentPage = 1
  $scope.ordersCurrentPage = 1

  $scope.producerFiltertype;
  $scope.clientFiltertype;

  $scope.promises = [];
  $scope.user;

  $scope.init = function(){
    UserService.me().then(function(response){
      $scope.user = response.id
      $scope.getClients('Creada' );
      $scope.getProducers('Creada' );
      $scope.getProjectsByProducer('Creada' );
      $scope.getProjectsByClient('Creada' );
    }, function(error){
      console.error("error",error);
    })
  }

  $scope.getClients = function(status, typeOfFilter, page=1){
    var query = {
      page:page,
      status: status
    };


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

  $scope.getProducers = function(status, page=1){
    var query = {
      page:page,
      status:status
    };

    $scope.producerStatus = status // status for display button according the promise
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

  $scope.getProjectsByProducer = function(status, page=1){
    var query = {
      page:page,
      status:status
    };

    $scope.projectProducerStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    ProjectListService.getList(query).then(
			function(response) {
				$scope.projectsByProducer = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  }

  $scope.getProjectsByClient = function(status, page=1){
    var query = {
      page:page,
      status:status
    };
    $scope.projectClientStatus = status // status for display button according the promise
    query.client = $scope.user; // id usuario

    ProjectListService.getList(query).then(
			function(response) {
				$scope.projectsByClient = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
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

  ///////////////////////////////////////Action buttons methods/////////////////////////////////////////////

  $scope.makeActionProducerProject = function(project,type){
    var actionType = {
      'Aceptada':'aceptar',
      'Terminada':'terminar',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type]+" este proyecto?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      project.status = type
      ProjectCreateService.update(project.id,project).then(
        function (response) {
          $scope.getProjectsByProducer($scope.projectProducerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }

  $scope.makeProducerActionProject = function(project,type){
    var actionType = {
      'Satisfactoria':'satisfactorio',
      'Insatisfactoria':'insatisfactorio',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere calificar este proyecto como "+ actionType[type]+" ?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      project.status = type
      ProjectCreateService.update(project.id,project).then(
        function (response) {
          $scope.getProjectsByClient($scope.producerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }

  $scope.makeProducerAction = function(action,type){
    var actionType = {
      'Satisfactoria':'satisfactoria',
      'Insatisfactoria':'insatisfactoria',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere calificar esta acción como "+ actionType[type]+" ?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      action.status = type
      ActionCreateService.update(action.id,action).then(
        function (response) {
          $scope.getProducers($scope.producerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }

  $scope.makeClientAction = function(action,type){
    var actionType = {
      'Aceptada':'aceptar',
      'Terminada':'terminar',
    }

    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type]+" esta accion?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
        action.status = type
        ActionCreateService.update(action.id,action).then(
          function (response) {
            $scope.getClients($scope.clientStatus);
            $mdDialog.alert()
               .clickOutsideToClose(true)
               .title('La accion ha sido '+ type)
               .ok('Ok')
          },
          function (errors) {
            console.error(errors);
          }
        )
    }, function() {
    });
  }
  ///////////////////////////////////////End Action buttons methods/////////////////////////////////////////////

}]);
