
app.controller('ActionDetailController', [
	'$scope', '$state', 'ProjectService', 'ActionListService', 'APIConfig',
	'ProducerGetListService', 'ActionGetService','ReportGetService','$mdDialog',
	'ActionCreateService', 'UserService', 'Notification',
	function($scope, $state, ProjectService, ActionListService, APIConfig,
		ProducerGetListService, ActionGetService, ReportGetService, $mdDialog, ActionCreateService, UserService, Notification) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	var actionStatus = "Pendiente"
	$scope.accomplishedStatus = 'Ejecutada'
	$scope.lastStatus = ['Ejecutada', 'Satisfactoria',  'Insatisfactoria']

	$scope.currentAction = {};
	$scope.project = {};
	$scope.producers = [];

  $scope.init = function() {
		UserService.me().then(function(response){
			$scope.user = response
		}, function(error){
			console.error("error",error);
		})
		$scope.getAction();
		$scope.actionPageChanged()
		$scope.producerPageChanged($scope.producersPerformanceCurrentPage, 'producers');
		$scope.producerPageChanged($scope.producersCurrentPage, 'producersPerformance');
		$scope.getReport();
	}

	//Service calls
	$scope.getAction = function() {
		ActionGetService.getById($state.params.id).then(
			function(response) {
				$scope.currentAction = response;
				console.log("imagen", response);
			},
			function(errorResponse) {
					console.log('errorResponse', errorResponse);
					$scope.status = errorResponse.statusText || 'Request failed';
					$scope.errors = errorResponse.data;
			}
		);
	}


	//////////////////////////////////////////////  reports////////////////////////////////////////

	$scope.getReport = function (){
    var query = {
      action_id:$state.params.id
    }
    ReportGetService.getList(query).then(
      function(response){
         $scope.report = response[response.length-1]
      }, function(errors){
        console.log(errors);
      });
  }

	$scope.openReportModal = function() {

		if ($scope.checkStatus('Pendiente')){
			Notification.info("Debe aceptar esta acción primero")
			return;
		}else if($scope.currentAction.advance_report_at ){
			Notification.info("No es posible agregar  otro reporte")
			return;
		}

		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-create/add-report.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 reportType: 'advance',
			 type:'action'
		 }
		}).then(function (obj) {
 		 if(obj.created == true){
 			 Notification.success("Se ha reportado el avance")
 			 $state.reload()
 		 }

 	 }).finally(function() {
		});
	}

	$scope.openReportDetailModal = function() {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportDetailController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-detail/report-detail.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 report: $scope.report
		 }
		})

	}

	$scope.actionFinishReport = function(){

		if ( !$scope.currentAction.advance_report_at ){
			Notification.info("Debe agregar reporte de avance  primero")
			return
		}else if ($scope.currentAction.ejecution_report_at ) {
			Notification.info("No es posible agregar  otro reporte")
			return
		}
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-create/add-report.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 type:'action',
			 reportType:'finish',
		 }
	 }).then(function (obj) {
		 if(obj.created == true){
			 Notification.success("La acción ha pasado a estatus de ejecutada")
			 $state.reload()
		 }

	 }).finally(function(response) {
    });
	}

	////////////////////////////////////////////// end reports////////////////////////////////////////

	////////////////////////////////////////////// modals////////////////////////////////////////

	$scope.closeAction = function(){

		if($scope.checkStatus('Satisfactoria') || $scope.checkStatus('Insatisfactoria')){
			Notification.info("La acción ya se encuentra  cerrada")
			return
		}else if (!$scope.checkStatus('Ejecutada')) {
			Notification.info("No es posible cerrar la acción, aun no esta  ejecutada")
			return;
		}

		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'CloseActionModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/action-detail/modals/close-action-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 action: $scope.currentAction
		 }
		}).finally(function() {

    });
	}

	$scope.seeDatesModal = function(action) {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'DatesModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/project-detail/modals/dates-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 project: $scope.currentAction,
			 type:'action'
		 }
	 })
	}

	//////////////////////////////////////////////end modals////////////////////////////////////////

	$scope.actionPageChanged = function(status) {
		actionStatus = status||actionStatus;

     	var query = {
			"parent_action_id": $state.params.id,
			"page": $scope.actionCurrentPage,
			"status": actionStatus,
		};

		ActionListService.getList(query).then(
			function(response) {
				$scope.actions = response;
				console.log("actions", response);
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	$scope.producerPageChanged = function(page, list) {

	  	var query = {
	  		"page": page,
	  		"parent_action_id": $state.params.id,
	  	};

		ProducerGetListService.getList(query).then(
			function(response) {
				$scope[list] = response;

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	//////////////////////////////////////////////template interaction functions////////////////////////////////////////
	$scope.chunkArray = function(index){
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);

	}

	$scope.getColor = function(phase){
			if($scope.currentAction.phase == phase){
				return 'bg-info '+ $scope.currentAction.color +'-status'
		}
	}


	//////////////////////////////////////////////template interaction functions////////////////////////////////////////

		$scope.actionCreate = function () {
			if ($scope.checkStatus('Pendiente')){
				Notification.info("Debe aceptar esta acción primero")
				return;
			}
			else if($scope.checkStatus('Aceptada')) {
				$state.go("actionCreate",{ projectId: $scope.currentAction.project.id, actionId:$scope.currentAction.id })
			}
			else{
				Notification.info("La acción ha sido ejecutada, no es posible agregar  otra acción")
			}
		}

	$scope.checkStatus =  function (status) {
		if ($scope.currentAction.status == status)
			return true;
		return false;
	}
}]);
