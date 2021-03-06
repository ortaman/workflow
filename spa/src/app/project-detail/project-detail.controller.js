
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ActionService', 'APIConfig', 'ProducerGetListService', '$uibModal','$mdDialog',
	 'UserService', 'Notification', 'MessagesService',
	function($scope, $state, ActionService, APIConfig, ProducerGetListService, $uibModal,$mdDialog ,
		UserService, Notification, MessagesService) {

   $scope.titles = {
     'project': {
       'type':'project',
			 'name': 'proyecto',
			 'nameCapitalized': 'Proyecto',
			 'theItem': 'El proyecto',
			 'thisItem': 'este proyecto'
     },
     'action':{
       'type':'action',
			 'name': 'acción',
			 'nameCapitalized': 'Acción',
			 'theItem': 'La acción',
			 'thisItem': 'esta acción'
     }
   }

	var type;

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	$scope.project = {};
	$scope.producers = [];
	$scope.producersPerformance = [];
	$scope.phases = ['Preparación','Negociación','Ejecución','Evaluación']


	var queryStatus = "Pendiente";

  	$scope.getProjectByIdInit = function() {
			//TODO cambiar user
			UserService.me().then(function(response){
				$scope.user = response
			}, function(error){
				console.error("error",error);
			})
			getProject();
			//$scope.getMessages();

	}

	//Service call
	$scope.getMessages = function(){
		MessagesService.getList(
		{
			action_id:  $state.params.id
		}).then(function(response){
			$scope.messages = response;
		})
	}

	var getProject = function() {
		ActionService.getById($state.params.id).then(
			function(response) {
				$scope.project = response;
				$scope.timeLineChanged();
				type  = response.parent_action == null ? 'project':'action';
				$scope.titles = $scope.titles[type];
				if (type == 'action') {
					$scope.project.image = $scope.project.project.image;
				}
				$scope.actionPageChanged()
				$scope.producerPageChanged($scope.producersCurrentPage,'producers' );
				$scope.producerPageChanged($scope.producersPerformanceCurrentPage,'producersPerformance' );
			},
			function(errorResponse) {
				Notification.error("Ocurrio  un error al recuperar  información")
			}
		);
	}

	$scope.getReport = function (){
		if($scope.project.reports)
			return $scope.project.reports.length > 0;
  }

	$scope.actionPageChanged = function(status) {
			queryStatus = status||queryStatus;
	  	var query = {
	  		"page": $scope.actionsCurrentPage,
	  		"parent_action_id": $state.params.id,
	  		"status": queryStatus,
	  	};
			//TODO cambiar servicio
			ActionService.getList(query).then(
				function(response) {
					$scope.actions = response;

				},
				function(errorResponse) {
					$scope.status = errorResponse.statusText || 'Request failed';
					$scope.errors = errorResponse.data;
				}
			);
  };

	$scope.timeLineChanged = function() {
	  	var query = {
	  		"project_id": $state.params.id,
				'begin_date': moment($scope.project.begin_at).format('YYYY-MM-DD'),
	      'end_date': moment($scope.project.accomplish_at).format('YYYY-MM-DD'),
	  	};

		ActionService.getList(query).then(
			function(response) {
				$scope.historyArray = [];
				$scope.historyArray.push($scope.project)

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
				'parent_action_id': $scope.project.id
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


	$scope.actionCopy = function(){
		$state.go('actionCopy',{action:$scope.project.id})
	}


	////////////////////////////////// reports/////////////////////////
	var basicModal = {
		scope:$scope,
		preserveScope:true,
		parent: angular.element(document.body),
		clickOutsideToClose:true,
		size: 'md',
		controllerAs: 'vm',
	}

	$scope.openReportDetailModal = function() {
		var modalVariables = {
		 controller: 'ReportDetailController',
		 templateUrl: '/app/report-detail/report-detail.html',
		 locals:{
			 type: type,
			 report: $scope.project.reports[1] || $scope.project.reports[0]
		 }
		}
		;
		$mdDialog.show(angular.extend(modalVariables, basicModal));
	}

	$scope.openfinishProjectReport = function(){
		if ( !$scope.project.advance_report_at ){
			Notification.info("Debe agregar reporte de avance  primero")
			return
		}else if ($scope.project.ejecution_report_at ) {
			Notification.info("No es posible agregar  otro reporte")
			return
		}

		var modalVariables = {
		 controller: 'ReportModalController',
		 templateUrl: '/app/report-create/add-report.html',
		 locals:{
			 type: type,
			 reportType:'finish',
		 }
	 }
	 angular.extend(modalVariables, basicModal)
		$mdDialog.show(modalVariables).then(function (obj) {
	 		if(obj.created == true){
				Notification.success($scope.titles['theItem'] + " ha pasado a estatus de ejecutado")
				$state.reload()
			}

	 }).finally(function(response) {
    });
	}

	$scope.openAdvanceReport = function() {
		if ($scope.checkStatus('Pendiente')){
			Notification.info("Debe aceptar "+ $scope.titles['thisItem']+ " primero")
			return;
		}else if($scope.project.advance_report_at ){
			Notification.info("No es posible agregar  otro reporte")
			return;
		}
		var modalVariables = {
		 controller: 'ReportModalController',
		 templateUrl: '/app/report-create/add-report.html',
		 locals:{
			 reportType:'advance',
		 }
		}

		angular.extend(modalVariables, basicModal);
		$mdDialog.show(modalVariables).then(function (obj) {
 		 if(obj.created == true){
 			 Notification.success("Se ha reportado el avance")
			 $state.reload()
 		 }

 	 }).finally(function() {
    });
	}
//////////////////////////////////end reports/////////////////////////

//////////////////////////////////modals//////////////////////////////

	$scope.closeProjectReport = function(action) {
		if($scope.checkStatus('Satisfactoria') || $scope.checkStatus('Insatisfactoria')){
			Notification.info($scope.titles['thisItem'] + " ya se encuentra  cerrado")
			return
		}else if (!$scope.checkStatus('Ejecutada')) {
			Notification.info("No es posible cerrar "+ $scope.titles['thisItem'] +", aun no esta  ejecutado")
			return;
		}

		var modalVariables = {
		 controller: 'CloseProjectModalController',
		 templateUrl: '/app/project-detail/modals/close-project-modal.html',
		 locals:{
			 type: type,
			 project: $scope.project
		 }
	 }
	 angular.extend(modalVariables, basicModal);
		$mdDialog.show(modalVariables).then(function() {
			$state.reload()
    });
	}

	$scope.seeDatesModal = function(action) {
		var modalVariables = {
		 controller: 'DatesModalController',
		 templateUrl: '/app/project-detail/modals/dates-modal.html',
		 locals:{
			 project: $scope.project,
			 type: type
		 }
	 }
	 angular.extend(modalVariables, basicModal);
		$mdDialog.show(modalVariables)
	}
//////////////////////////////////end modals//////////////////////////////


//////////////////////////////////template interaction functions//////////////////////////////////
	$scope.chunkArray = function(index) {
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);
	}
	$scope.getColor = function(phase){
				if($scope.project.phase == phase){
					return 'bg-info '+$scope.project.color +'-status'
			}
		}
//////////////////////////////////end template interaction functions //////////////////////////////////

	$scope.actionCreate = function () {
		if ($scope.checkStatus('Pendiente')){
			Notification.info("Debe aceptar "+$scope.titles['theItem']+" primero")
			return;
		}
		else if($scope.checkStatus('Aceptada')) {
			$state.go("projectCreate",{ parentProject: $scope.project.id })
			return;
		}
		else{
			Notification.info($scope.titles['theItem']+" ha sido ejecutado, no es posible agregar  otra acción")
			return;
		}
	}

	$scope.moveTophase = function () {

		if ($scope.project.phase == $scope.phases[$scope.phases.length-1]){
			Notification.info('El proyecto ya se encuentra en la última fase');
			return;
		}
		var newPhase = $scope.phases[$scope.phases.indexOf($scope.project.phase)+1];

		var confirm = $mdDialog.confirm()
				.title("¿Está seguro que quiere pasar a fase de " + newPhase)
				.ok('Sí')
				.cancel('No');

		$mdDialog.show(confirm).then(function() {
			Notification.info('Espere un momento');
			var project = angular.copy($scope.project);
			project.phase = newPhase;
			ActionService.patch(project.id, project).then(
				function (response) {
					$mdDialog.hide();
					Notification.success($scope.titles['theItem']+" ha pasado a fase de "+newPhase)
					$state.reload()
				},
				function (errorResponse) {
					console.error('errorResponse', errorResponse);
				}
			);
		}, function() {
		});
	}

	$scope.checkStatus =  function (status) {
		if ($scope.project.status == status)
			return true;
		return false;
	}

	$scope.checkRole = function (toValidate) {
		var value = false;
		if ($scope.project.id) {
			toValidate.forEach(function (rol) {
				if ($scope.project[rol].id ==  $scope.user.id) {
					value = true;
				}
			})
		}
		return value;
	}

	$scope.isProject = function(){
		return type == 'project';
	}
}]);
