
app.controller('ActionDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig',
	'ProducerGetListService', 'ActionGetService','ReportGetService','$mdDialog',
	'ActionCreateService', 'UserService', 'Notification',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig,
		ProducerGetListService, ActionGetService, ReportGetService, $mdDialog, ActionCreateService, UserService, Notification) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	var actionStatus = "Creada"
	$scope.accomplishedStatus = 'Terminada'

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
         $scope.report = response[0]
      }, function(errors){
        console.log(errors);
      });
  }

	$scope.openReportModal = function() {

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
			 type:'action'
		 }
		})
		.finally(function() {
			$scope.getReport()
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
		 if(obj.created == true)
			 Notification.success("La acción ha pasado a estatus de terminada")

	 }).finally(function(response) {
      	$scope.getReport()
    });
	}

	////////////////////////////////////////////// end reports////////////////////////////////////////

	////////////////////////////////////////////// modals////////////////////////////////////////

	$scope.closeAction = function(){
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
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index){
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);

	}

	$scope.getColor = function(phase){
			if($scope.currentAction.phase == phase){
				if(moment($scope.currentAction.report_at).isBefore(moment()) && !$scope.report)
					return 'bg-info red-status'

				if(moment($scope.currentAction.report_at).isAfter(moment()) && !$scope.report)
					return 'bg-info yellow-status'

			return 'bg-info green-status'
		}
	}
	//////////////////////////////////////////////template interaction functions////////////////////////////////////////

}]);
