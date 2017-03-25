
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService',
	function($scope, $state, ProjectGetService, ActionListService) {

	$scope.currentPage = 1;

  $scope.getProjectByIdInit = function() {
    ProjectGetService.getById($state.params.id).then(
      function(response) {
        $scope.project = response;
      },
      function(errorResponse) {
        var error = errorResponse || 'Request failed';
          console.log('error', error);
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
				error = errorResponse || 'Request failed';
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
