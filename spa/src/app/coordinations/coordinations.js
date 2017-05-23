
app.controller('CoordinationsController', ['$scope','ActionListService','UserService','ActionCreateService','$mdDialog',
  'APIConfig','ProjectListService','ProjectCreateService' , 'StadisticsService', 'Notification',
  function($scope, ActionListService, UserService, ActionCreateService, $mdDialog, APIConfig, ProjectListService, ProjectCreateService,
     StadisticsService, Notification) {

  $scope.promisesCurrentPage = 1
  $scope.ordersCurrentPage = 1

  $scope.producerFiltertype;
  $scope.clientFiltertype;

  $scope.promises = [];
  $scope.user;
  $scope.type = 'project',

  $scope.init = function(){
    UserService.me().then(function(response){
      $scope.user = response.id
      $scope.getProjectsByProducer('Creada' );
      $scope.getProjectsByClient('Creada' );
      $scope.getStadistics();
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

    $scope.promisesByClientPromise = ActionListService.getList(query).then(
      function(response) {
          $scope.promises = response;
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

    $scope.ordersByProducerPromise = ActionListService.getList(query).then(
      function(response) {
          $scope.orders = response;
      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.getProjectsByProducer = function(status, page=1){
    $scope.projectsByProducer = []

    var query = {
      page:page,
      status:status
    };

    $scope.projectProducerStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    $scope.projectsProducerPromise = ProjectListService.getList(query).then(
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

    $scope.projectsClientPromise = ProjectListService.getList(query).then(
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
      'Ejecutada':'terminar',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type]+" este proyecto?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      project.status = type
      Notification.info('Espere un momento');
      ProjectCreateService.update(project.id,project).then(
        function (response) {
          if (type == "Aceptada")
            Notification.success('El proyecto ha pasado a proyectos aceptados');
          else if (type == "Ejecutada")
            Notification.success('El proyecto ha pasado a proyectos terminados');
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
      Notification.info('Espere un momento');

      ProjectCreateService.update(project.id,project).then(
        function (response) {
          if (type == "Satisfactoria")
            Notification.success('El proyecto ha pasado a proyectos cumplidos satisfactoriamente');
          else if (type == "Insatisfactoria")
            Notification.success('El proyecto ha pasado a proyectos cumplidos insatisfactoriamente');

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
      Notification.info('Espere un momento');
      ActionCreateService.update(action.id,action).then(
        function (response) {
          if (type == "Satisfactoria")
            Notification.success('La acción ha pasado a acciones cumplidas satisfactoriamente');
          else if (type == "Insatisfactoria")
            Notification.success('La acción ha pasado a acciones cumplidas insatisfactoriamente');
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
      'Ejecutada':'terminar',
    }

    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type]+" esta accion?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
        action.status = type
        Notification.info('Espere un momento');
        ActionCreateService.update(action.id,action).then(
          function (response) {
            if (type == "Aceptada")
              Notification.success('La acción ha pasado a acciones aceptadas');
            else if (type == "Ejecutada")
              Notification.success('La acción ha pasado a acciones ejecutadas');
            $scope.getClients($scope.clientStatus);
          },
          function (errors) {
            console.error(errors);
          }
        )
    }, function() {
    });
  }
  ///////////////////////////////////////End Action buttons methods/////////////////////////////////////////////
  $scope.onPromiseTypeSelect = function (type) {
    console.log(type);
    if(type == 'action'){
      $scope.getClients('Creada' );
      $scope.getProducers('Creada' );
    }else {
      $scope.getProjectsByProducer('Creada' );
      $scope.getProjectsByClient('Creada' );
    }
  }


  ///////////////////////////////////////stadistics/////////////////////////////////////////////
  $scope.getStadistics = function () {
    StadisticsService.get().then(function (response) {
      $scope.stadistics = response;
    },function (error) {
      console.error(error);
    })
  }
}]);
