
app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService',
	function($scope, $state, ProjectGetService, ActionListService) {

  //$scope.getProjectByIdInit = function() {
    ProjectGetService.getById($state.params.id).then(
      function(response) {
        $scope.project = response;
        console.log('getProjectById', response);
      },
      function(errorResponse) {
        var error = errorResponse || 'Request failed';
          console.log('error', error);
        }
    );
  //}


	ActionListService.getList().then(
		function(response) {
        $scope.actions = response;
        console.log('getListActions', response);
		},
		function(errorResponse) {
			  error = errorResponse || 'Request failed';
    		console.log('error', error);
  		}
	);

}]);
