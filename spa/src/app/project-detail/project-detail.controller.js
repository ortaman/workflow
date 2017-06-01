
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectService', 'ActionListService', 'APIConfig', 'ProducerGetListService', '$uibModal','$mdDialog',
	'ReportGetService', 'UserService', 'Notification',
	function($scope, $state, ProjectService, ActionListService, APIConfig, ProducerGetListService, $uibModal,$mdDialog,
		 ReportGetService ,UserService, Notification) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	$scope.project = {};
	$scope.producers = [];
	$scope.producersPerformance = [];
	$scope.accomplishedStatus = 'Ejecutada'
	$scope.phases = ['Preparación','Negociación','Ejecución','Evaluación']


	var queryStatus = "Pendiente";

  	$scope.getProjectByIdInit = function() {
			UserService.me().then(function(response){
				$scope.user = response
			}, function(error){
				console.error("error",error);
			})
			getProject();
			$scope.actionPageChanged()
			$scope.producerPageChanged($scope.producersCurrentPage,'producers' );
			$scope.producerPageChanged($scope.producersPerformanceCurrentPage,'producersPerformance' );
			$scope.getReport();

	}

	//Service call
	var getProject = function() {
		ProjectService.getById($state.params.id).then(
			function(response) {
				response.image = APIConfig.baseUrl + response.image;
				response.producer.photo = APIConfig.baseUrl + response.producer.photo;
				$scope.project = response;
				$scope.timeLineChanged();

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
	}

	$scope.getReport = function (){
    var query = {
      project_id: $state.params.id,
      action_id:'None'
    }
    ReportGetService.getList(query).then(
      function(response){
         $scope.report = response[response.length-1]
      }, function(errors){
        console.err(errors);
      });
  }

	$scope.actionPageChanged = function(status) {
			queryStatus = status||queryStatus;
	  	var query = {
	  		"page": $scope.actionsCurrentPage,
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
	  		"status": queryStatus,
	  	};

			ActionListService.getList(query).then(
				function(response) {
					$scope.actions = response;
					console.log(response);

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



	$scope.getColor = function(phase){
	 			if($scope.project.phase == phase){
	 				return 'bg-info '+$scope.project.color +'-status'
	 		}
	 	}

	////////////////////////////////// reports/////////////////////////

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

	$scope.openfinishProjectReport = function(){
		if ( !$scope.project.advance_report_at ){
			Notification.info("Debe agregar reporte de avance  primero")
			return
		}else if ($scope.project.ejecution_report_at ) {
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
			 type:'project',
			 reportType:'finish',
		 }
	 }).then(function (obj) {
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
			 type:'project',
			 reportType:'advance',
		 }
		}).then(function (obj) {
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

		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'CloseProjectModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/project-detail/modals/close-project-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 project: $scope.project
		 }
	 }).then(function() {
			$state.reload()
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
			 project: $scope.project,
			 type:'project'
		 }
	 })
	}
//////////////////////////////////end modals//////////////////////////////


//////////////////////////////////template interaction functions//////////////////////////////////
	$scope.chunkArray = function(index) {
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);
	}
//////////////////////////////////end template interaction functions //////////////////////////////////

	$scope.actionCreate = function () {
		if ($scope.checkStatus('Pendiente')){
			Notification.info("Debe aceptar este proyecto primero")
			return;
		}
		else if($scope.checkStatus('Aceptada')) {
			$state.go("actionCreate",{ projectId: $scope.project.id })
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
}]);
