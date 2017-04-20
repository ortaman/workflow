
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService', '$uibModal','$mdDialog', 'ReportGetService',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService, $uibModal,$mdDialog, ReportGetService) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	$scope.project = {};
	$scope.producers = [];
	$scope.producersPerformance = [];
	$scope.timelines = []

	var queryStatus = "Abierta";
	var dateFields = {
      'accomplish_at':'Fecha de cumplimiento',
      'report_at':'Fecha de reporte',
      'begin_at':'Fecha de inicio',
    };

  	$scope.getProjectByIdInit = function() {
			getProject();
			$scope.actionPageChanged()
			$scope.producerPageChanged($scope.producersCurrentPage,'producers' );
			$scope.producerPageChanged($scope.producersPerformanceCurrentPage,'producersPerformance' );
			$scope.getReport();
	}

	//Service call
	var getProject = function() {
		ProjectGetService.getById($state.params.id).then(
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
         $scope.report = response[0]
      }, function(errors){
        console.log(errors);
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
				$scope.timelines = transformActions(response);

				$.getScript("/assets/metronics/global/plugins/horizontal-timeline/horizontal-timeline.js", function(){});
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

				for (var i=0; i < response.producers.length; i++) {
					response.producers[i].producer.photo = APIConfig.baseUrl + response.producers[i].producer.photo;
				}

				$scope[list] = response;

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  };


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
			 type:'project'
		 }
		}).finally(function() {
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

	//template interaction functions
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index) {
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);
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


		var newArray = [];
		angular.forEach(results, function (result) {
			angular.forEach(dateFields, function(key, value){
				var obj = {}
				obj.timeline = result[value];
				obj.actions = [];
				result.timeline_text = key
				obj.actions.push(angular.copy(result))
				newArray.push(obj)

			})
		})

		newArray = newArray.sort(custom_sort);
		var newArray = UniqueArraybyId(newArray,'timeline');


		//asign photo
		newArray.forEach(function(item){
			angular.forEach(item.actions, function(item2){
				item2.producer.photo =  APIConfig.baseUrl+ angular.copy(item2.producer.photo);
			})
		})
		//end of asignment

		return newArray;
	}
}]);
