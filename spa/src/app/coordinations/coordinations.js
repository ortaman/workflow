
app.controller('CoordinationsController', ['$scope','UserService','$mdDialog',
  'APIConfig','ProjectService' , 'StadisticsService', 'Notification','$state',
  function($scope, UserService, $mdDialog, APIConfig, ProjectService,
     StadisticsService, Notification, $state) {


   $scope.titles = {
     'project': {
       'name1': 'El proyecto',
       'name2': 'proyecto',
       'this':' este proyecto',
     },
     'action':{
       'name1': 'La acción',
       'name2': 'acción',
       'this':' esta acción',
     }
   }

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
      $scope.getProjectsByProducer('Pendiente' );
      $scope.getProjectsByClient('Pendiente' );
      $scope.getStadistics();
    }, function(error){
      console.error("error",error);
    })
  }



  $scope.getProjectsByProducer = function(status, page=1){
    $scope.projectsByProducer = []

    var query = {
      page:page,
      status:status
    };

    $scope.projectProducerStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    $scope.projectsProducerPromise = ProjectService.getList(query).then(
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

    $scope.projectsClientPromise = ProjectService.getList(query).then(
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





  ///////////////////////////////////////Action buttons methods/////////////////////////////////////////////

  $scope.changeAction = function(project,type){
    var objType = project.parent_action == null ? 'project': 'action';
    $scope.titles = $scope.titles[objType];

    var actionType = {
      'Aceptada':'aceptar',
      'Ejecutada':'terminar',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type] + $scope.titles['this'] +"?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      project.status = type
      Notification.info('Espere un momento');
      ProjectService.patch(project.id,project).then(
        function (response) {
          if (type == "Aceptada"){
            Notification.success($scope.titles['name1']+ 'ha pasado a '+ $scope.titles['name2']+ ' aceptados');
            $state.go("projectDetail", {id: project.id})
          }
          else if (type == "Ejecutada")
            Notification.success($scope.titles['name1']+ ' ha pasado a '+ $scope.titles['name2']+ ' terminados');
          $scope.getProjectsByProducer($scope.projectProducerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }



  ///////////////////////////////////////End Action buttons methods/////////////////////////////////////////////


  ///////////////////////////////////////stadistics/////////////////////////////////////////////
  $scope.getStadistics = function () {
    StadisticsService.get().then(function (response) {
      $scope.stadistics = response;
    },function (error) {
      console.error(error);
    })
  }
}]);
