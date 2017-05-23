
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService', '$uibModal','$mdDialog',
	'ReportGetService','ProjectCreateService', 'UserService', 'Notification',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService, $uibModal,$mdDialog,
		 ReportGetService, ProjectCreateService,UserService, Notification) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	$scope.project = {};
	$scope.producers = [];
	$scope.producersPerformance = [];
	$scope.accomplishedStatus = 'Ejecutada'

	var queryStatus = "Creada";


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
         $scope.report = response[response.length-1]
      }, function(errors){
        console.err(errors);
      });
  }

	$scope.actionPageChanged = function(status) {
			console.log("hola");
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
				$scope.timelines = response;

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
				Notification.success("El proyecto ha pasado a estatus de terminado")
				$state.reload()
			}

	 }).finally(function(response) {
    });
	}

	$scope.openAdvanceReport = function() {

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
	$scope.openActionDetailModal = function(action) {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ActionViewModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/project-detail/modals/action-detail-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 currentAction: action.id
		 }
		}).finally(function() {

    });
	}

	$scope.closeProjectReport = function(action) {
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
		}).finally(function() {

    });
	}
//////////////////////////////////end modals//////////////////////////////


//////////////////////////////////template interaction functions//////////////////////////////////
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index) {
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);
	}
//////////////////////////////////end template interaction functions //////////////////////////////////

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
