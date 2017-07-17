
app.controller('CoordinationsController', ['$scope','UserService','$mdDialog','ActionService' , 'StadisticsService', 'Notification','$state',
  function($scope, UserService, $mdDialog, ActionService,
     StadisticsService, Notification, $state) {

   $scope.titles = {
     'project': {
       'name1': 'El proyecto ',
       'name2': 'proyecto ',
       'this':' este proyecto ',
     },
     'action':{
       'name1': 'La acción ',
       'name2': 'acción',
       'this':' esta acción ',
     }
   }

  $scope.promisesCurrentPage = 1
  $scope.ordersCurrentPage = 1

  $scope.producerFiltertype;
  $scope.clientFiltertype;

  $scope.user;

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



  $scope.getProjectsByProducer = function(status){
    if (status)
      $scope.producerFiltertype = status;
    status = status || $scope.producerFiltertype;

    var query = {
      page:$scope.promisesCurrentPage,
      status:status
    };

    $scope.projectProducerStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    $scope.projectsProducerPromise = ActionService.getList(query).then(
			function(response) {
				$scope.projectsByProducer = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
        Notification.error("Error al obtener resultados");
			}
		);
  }

  $scope.getProjectsByClient = function(status){
    if (status)
      $scope.clientFiltertype = status;
    status = status || $scope.clientFiltertype;

    var query = {
      page:$scope.ordersCurrentPage,
      status:status
    };
    $scope.projectClientStatus = status // status for display button according the promise
    query.client = $scope.user; // id usuario

    $scope.projectsClientPromise = ActionService.getList(query).then(
			function(response) {
				$scope.projectsByClient = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
        Notification.error("Error al obtener resultados");
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
      project.accepted_at = moment().format("YYYY-MM-DD")
      
      Notification.info('Espere un momento');
      ActionService.patch(project.id,project).then(
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
