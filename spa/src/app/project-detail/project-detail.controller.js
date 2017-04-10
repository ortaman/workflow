
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
	$scope.timelines = []


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
				response.image = APIConfig.baseUrl + response.image;
				response.producer.photo = APIConfig.baseUrl + response.producer.photo;

				$scope.project = response;
			},
			function(errorResponse) {
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
				"begin_date": moment(timelineDate.init_date).format('YYYY-MM-DD'),
 			 	"end_date": moment(timelineDate.end_date).format('YYYY-MM-DD'),
	  	};



		ActionListService.getList(query).then(
			function(response) {
				$scope.timelines = getResults(response);
				console.log("timeline", $scope.timelines);

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
					response.results[i].producer.photo = APIConfig.baseUrl + response.results[i].producer.photo;
				}

				$scope.producers = response;

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

	var getResults = function(results){
		function custom_sort(a, b) {
		    return new Date(a.timeline).getTime() - new Date(b.timeline).getTime();
		}

		results = results.sort(custom_sort);

		var newArray = [];
		for(var i =0;i<results.length;i++){
			if (typeof results[i-1] != 'undefined'){
				if(results[i-1].timeline == results[i].timeline){
					results[i-1].actions.push(results[i].actions[0])
				}
				else {
					newArray.push(results[i]);

				}
			}
		}
		newArray.forEach(function(item){
			angular.forEach(item.actions, function(item2){
				item2.producer.photo =  APIConfig.baseUrl+ item2.producer.photo;
			})
		})
		return newArray;
	}
}]);
