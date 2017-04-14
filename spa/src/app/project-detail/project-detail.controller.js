
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;


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
		$scope.timeLineChanged();

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

	$scope.timeLineChanged = function() {
	  	var query = {
	  		"project_id": $state.params.id,
				'begin_date': moment('2017-01-01').format('YYYY-MM-DD'),
	      'end_date': moment('2017-11-11').format('YYYY-MM-DD'),
	  	};

		ActionListService.getList(query).then(
			function(response) {
				$scope.timelines = transformActions(response);
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

	var transformActions = function(results){
		//private functions
		function custom_sort(a, b) {
		    return new Date(a.timeline).getTime() - new Date(b.timeline).getTime();
		}

		function arrayObjectIndexOf(myArray, searchTerm, property) {
		    for(var i = 0, len = myArray.length; i < len; i++) {
		        if (myArray[i][property] === searchTerm) return i;
		    }
		    return -1;
		}

		function UniqueArraybyId(collection, keyname) {
              var output = [],
                  keys = [], d  =[];

              angular.forEach(collection, function(item) {
                  var key = item[keyname];
                  if(keys.indexOf(key) === -1) {
                      keys.push(key);
                      output.push(item);
                  }
									else{
										var pos = arrayObjectIndexOf(output,key,'timeline');
										output[pos].actions.push(item.actions[0])
									}
              });
							angular.forEach(d, function(item){
								var key = item[keyname];
							})
        return output;
		}

		results = results.sort(custom_sort);
		var results = UniqueArraybyId(results,'timeline');

		results.forEach(function(item){
			angular.forEach(item.actions, function(item2){
				item2.producer.photo =  APIConfig.baseUrl+ item2.producer.photo;
			})
		})
		return results;
	}
}]);
