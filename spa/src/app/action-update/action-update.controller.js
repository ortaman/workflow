
app.controller('ActionUpdateController', [
  '$scope', '$state','ActionGetService', 'ActionUpdateService',
  function($scope, $state, ActionGetService, ActionUpdateService) {

    $scope.submitted = false;
    $scope.action = {};

    $scope.getActionByIdInit = function() {
      ActionGetService.getById($state.params.id).then(
        function(response) {
          $scope.action = response;
        },
        function(errorResponse) {
          var error = errorResponse || 'Request failed';
            console.log('error', error);
          }
      );
    }

    $scope.submit = function() {
      $scope.submitted = true;
      var action = angular.copy($scope.action);
      
      if ($scope.actionForm.$invalid) {
        $scope.error = 'El formulario no es válido o no ha sido modificado.';
        return;
      }

  		ActionUpdateService.update($state.params.id, action).then(
  			function(response) {
  				$state.go('projectDetail',{id:action.project});
  			},
  			function(errorResponse) {
  				var error = errorResponse || 'Request failed';
  	    		console.log('error', error);
  	  		}
  		);

    }

}]);
