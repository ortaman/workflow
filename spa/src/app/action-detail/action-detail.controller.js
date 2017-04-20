
app.controller('ActionDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig',
	'ProducerGetListService', 'ActionGetService','ReportGetService','$mdDialog',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig,
		ProducerGetListService, ActionGetService, ReportGetService, $mdDialog) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	var actionStatus = "Abierta"

	$scope.currentAction = {};
	$scope.project = {};
	$scope.producers = [];

  	$scope.init = function() {
		$scope.getAction();
		$scope.actionPageChanged()
		$scope.producerPageChanged();
		$scope.getReport();
	}

	//Service call

	$scope.getAction = function() {
		ActionGetService.getById($state.params.id).then(
			function(response) {
				$scope.currentAction = response;
				$scope.currentAction.producer.photo = APIConfig.baseUrl + response.producer.photo;
				$scope.currentAction.project.image = APIConfig.baseUrl + response.project.image;
				console.log("imagen", response);
			},
			function(errorResponse) {
					console.log('errorResponse', errorResponse);
					$scope.status = errorResponse.statusText || 'Request failed';
					$scope.errors = errorResponse.data;
			}
		);
	}

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

	$scope.producerPageChanged = function() {

	  	var query = {
	  		"page": $scope.producersCurrentPage,
	  		"parent_action_id": $state.params.id,
	  	};

		ProducerGetListService.getList(query).then(
			function(response) {
				for (var i=0; i < response.results.length; i++) {
					console.log(response.results[i].producer.photo);
					response.results[i].producer.photo = APIConfig.baseUrl + response.results[i].producer.photo;
				}

				$scope.producers = response;
				console.log("ProducerGet", response);

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	//template interaction functions
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index){
		if($scope.producers.results)
			return $scope.producers.results.slice(index*3, (index*3)+3);

	}

}]);
