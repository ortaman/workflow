
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;

	var queryStatus = "open";

	$scope.project = {};
	$scope.producers = [];

  	$scope.getProjectByIdInit = function() {
		getProject();
		$scope.actionPageChanged()
		$scope.producerPageChanged();

		$scope.timeline = [
			{
				"name":"inicio del proyecto",
				"date":"01/01/2014",
				"producer":{
					"first_surname":"juanito",
				},
				"date2":"16 Enero 2017 : 7:45 PM",
				"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"
			},
			{
				"name":"inicio2 del proyecto",
				"date":"02/01/2014",
				"producer":{
					"first_surname":"juanito2",
				},
				"date2":"16 Enero 2017 : 7:45 PM",
				"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"
			},
			{
				"name":"inicio3 del proyecto",
				"date":"03/01/2014",
				"producer":{
					"first_surname":"juanito",
				},
				"date2":"16 Enero 2017 : 7:45 PM",
				"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"
			},
			{
				"name":"inici4 del proyecto",
				"date":"04/01/2014",
				"producer":{
					"first_surname":"juanito",
				},
				"date2":"16 Enero 2017 : 7:45 PM",
				"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"
			},
		]
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
		$.getScript("/assets/metronics/global/plugins/horizontal-timeline/horizontal-timeline.js", function(){});

	}

	$scope.actionPageChanged = function() {

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

	$scope.queryOpenStatus = function() {
		queryStatus = "open";
		$scope.actionPageChanged()
	}

	$scope.queryCloseStatus = function() {
		queryStatus = "close";
		$scope.actionPageChanged()
	}

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
					response.results[i].producer.photo = APIConfig.baseUrl + response.results[i].producer.photo.substring(32);
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
