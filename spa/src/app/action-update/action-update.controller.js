
app.controller('ActionUpdateController', [
  '$scope', '$state','ActionGetService', 'ActionUpdateService',
  function($scope, $state, ActionGetService, ActionUpdateService) {

    $scope.submitted = false;
    $scope.action = {};

    $scope.getActionByIdInit = function() {
      ActionGetService.getById($state.params.id).then(
        function(response) {
          $scope.action = response;
          $scope.action.accomplish_at = new Date($scope.action.accomplish_at);
          $scope.action.expire_at = new Date($scope.action.expire_at);
          $scope.action.renegotiation_at = new Date($scope.action.renegotiation_at);
          $scope.action.report_at = new Date($scope.action.report_at);
          $scope.action.begin_at = new Date($scope.action.begin_at);

        },
        function(errorResponse) {
          var error = errorResponse || 'Request failed';
            console.log('error', error);
          }
      );
    }

    $scope.submit = function() {
      $scope.submitted = true;

      if ($scope.actionForm.$invalid) {
        $scope.error = 'El formulario no es válido o no ha sido modificado.';
        return;
      }
        var action = angular.copy($scope.action);
        action.project = action.project.id;
        action.accomplish_at = moment(action.accomplish_at).format("DD-MM-YYYY");
        action.expire_at = moment(action.expire_at).format("DD-MM-YYYY");
        action.renegotiation_at = moment(action.renegotiation_at).format("DD-MM-YYYY");
        action.report_at = moment(action.report_at).format("DD-MM-YYYY");
        action.begin_at = moment(action.begin_at).format("DD-MM-YYYY");

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
