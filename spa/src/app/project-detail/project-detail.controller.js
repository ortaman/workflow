
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig) {

	$scope.currentPage = 1;
	$scope.project = {};

    $scope.getProjectByIdInit = function() {
	    ProjectGetService.getById($state.params.id).then(
	        function(response) {
		      	console.log('getById', response);
		        $scope.project = response;
		        $scope.project.image = APIConfig.baseUrl + response.image;
		        $scope.project.producer.photo = APIConfig.baseUrl + response.producer.photo;
	        },
		    function(errorResponse) {
		        console.log('errorResponse', errorResponse);
		        $scope.status = errorResponse.statusText || 'Request failed';
		        $scope.errors = errorResponse.data;
	        }
	    );

		$scope.pageChanged()
	
	}

	$scope.pageChanged = function() {

	  	var query = {"page": $scope.currentPage};

		ActionListService.getList(query).then(
			function(response) {
				$scope.actions = response
			},
			function(errorResponse) {
				console.log('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	$scope.hoverIn = function(){
		this.hoverEdit = true;
	};

	$scope.hoverOut = function(){
		this.hoverEdit = false;
	};

}]);
