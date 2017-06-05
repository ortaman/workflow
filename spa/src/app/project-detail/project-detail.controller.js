
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectService', 'ActionListService', 'APIConfig', 'ProducerGetListService', '$uibModal','$mdDialog',
	'ReportGetService', 'UserService', 'Notification',
	function($scope, $state, ProjectService, ActionListService, APIConfig, ProducerGetListService, $uibModal,$mdDialog,
		 ReportGetService ,UserService, Notification) {

   $scope.titles = {
     'project': {
       'type':'project',
			 'name': 'proyecto'
     },
     'action':{
       'type':'action',
			 'name': 'acción'
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
			$scope.actionPageChanged()
			$scope.producerPageChanged($scope.producersCurrentPage,'producers' );
			$scope.producerPageChanged($scope.producersPerformanceCurrentPage,'producersPerformance' );
	}

	//Service call
	var getProject = function() {
		ProjectService.getById($state.params.id).then(
			function(response) {
				$scope.project = response;
				$scope.timeLineChanged();
				type  = response.parent_action == null ? 'project':'action';
				$scope.titles = $scope.titles[type];

			},
			function(errorResponse) {
				Notification.error("Ocurrio  un error al recuperar  información")
			}
		);
	}

	$scope.getReport = function (){
		if ($scope.project.ejecution_report || $scope.project.advance_report)
			return true;
		return false;
  }

	$scope.actionPageChanged = function(status) {
			queryStatus = status||queryStatus;
	  	var query = {
	  		"page": $scope.actionsCurrentPage,
	  		"parent_action_id": $state.params.id,
	  		"status": queryStatus,
	  	};
			//TODO cambiar servicio
			ActionListService.getList(query).then(
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

		ActionListService.getList(query).then(
			function(response) {
				$scope.timelines = angular.copy(response);
				$scope.timelines.push($scope.project)

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
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
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
			 report: $scope.report
		 }
		}
		angular.extend(modalVariables, {basicModal});
		$mdDialog.show(modalVariables);
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
			 type:'project',
			 reportType:'finish',
		 }
	 }
	 angular.extend(modalVariables, basicModal)
		$mdDialog.show(modalVariables).then(function (obj) {
	 		if(obj.created == true){
				Notification.success("El proyecto ha pasado a estatus de ejecutado")
				$state.reload()
			}

	 }).finally(function(response) {
    });
	}

	$scope.openAdvanceReport = function() {
		if ($scope.checkStatus('Pendiente')){
			Notification.info("Debe aceptar este proyecto primero")
			return;
		}else if($scope.project.advance_report_at ){
			Notification.info("No es posible agregar  otro reporte")
			return;
		}

		var modalVariables = {
		 controller: 'ReportModalController',
		 templateUrl: '/app/report-create/add-report.html',
		 locals:{
			 type:'project',
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
			Notification.info("El proyecto ya se encuentra  cerrado")
			return
		}else if (!$scope.checkStatus('Ejecutada')) {
			Notification.info("No es posible cerrar el proyecto, aun no esta  ejecutado")
			return;
		}

		var modalVariables = {
		 controller: 'CloseProjectModalController',
		 templateUrl: '/app/project-detail/modals/close-project-modal.html',
		 locals:{
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
			 type:'project'
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
			Notification.info("Debe aceptar este proyecto primero")
			return;
		}
		else if($scope.checkStatus('Aceptada')) {
			$state.go("projectCreate",{ parentProject: $scope.project.id })
			return;
		}
		else{
			Notification.info("El proyecto ha sido ejecutado, no es posible agregar  otra acción")
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
			ProjectService.patch(project.id, project).then(
				function (response) {
					$mdDialog.hide();
					Notification.success("El proyecto ha pasado a fase de "+newPhase)
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
		if ($scope.project[toValidate]) {
			toValidate.forEach(function (rol) {
				if ($scope.project[rol].id ==  $scope.user.id) {
					value = true;
				}
			})
		}
		return value;
	}

	$scope.isProject = function(){
		if (type == 'project')
			return true;
		return false;
	}
}]);
