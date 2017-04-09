
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	var currentDate = new Date();
	var nexttDate = new Date();
	$scope.timelineDate = {
		"start": currentDate,
		"end": currentDate,
	}

	var queryStatus = "open";
	var dateFields = [
			'accomplish_at',
			'expire_at',
			'renegotiation_at',
			'report_at',
			'begin_at'
	];
	
	$scope.project = {};
	$scope.producers = [];
	$scope.timeline = []


  	$scope.getProjectByIdInit = function() {
		getProject();
		$scope.actionPageChanged()
		$scope.producerPageChanged();
		$scope.timeLineChanged($scope.timelineDate);

	}

	//Service call
	var getProject = function() {
		ProjectGetService.getById($state.params.id).then(
			function(response) {
				console.log("ProjectGet", response);
				response.image = APIConfig.baseUrl + response.image;
				response.producer.photo = APIConfig.baseUrl + response.producer.photo;

				$scope.project = response;
			},
			function(errorResponse) {
				console.log('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
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
				console.log("ActionList", response);
				$scope.actions = response;
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  };

	$scope.timeLineChanged = function(_timelineDate) {
			var timelineDate = angular.copy(_timelineDate);
	  	var query = {
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
	  		"begin_date": moment(timelineDate.init_date).format('YYYY-MM-DD'),
	  		"end_date": moment(timelineDate.end_date).format('YYYY-MM-DD'),
	  	};

		ActionListService.getList(query).then(
			function(response) {
				$scope.timeline = response.results;
				for (var i=0; i < $scope.timeline.length; i++) {
					$scope.timeline[i].producer.photo = APIConfig.baseUrl + $scope.timeline[i].producer.photo;
				}
				$.getScript("/assets/metronics/global/plugins/horizontal-timeline/horizontal-timeline.js", function(){});
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
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
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

	$scope.chunkArray = function(index) {
		if($scope.producers.results)
			return $scope.producers.results.slice(index*3, (index*3)+3);


	}

}]);
