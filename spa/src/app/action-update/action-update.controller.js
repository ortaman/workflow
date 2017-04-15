
app.controller('ActionUpdateController', [
  '$scope', '$state','ActionGetService', 'ActionUpdateService',
  function($scope, $state, ActionGetService, ActionUpdateService) {

    $scope.submitted = false;
    $scope.action = {};

    $scope.updateLimitDates = function() {

      switch($scope.action.phase) {
          case 'Preparación':
              $scope.minDate = new Date($scope.action.project.begin_at);
              $scope.maxDate = new Date($scope.action.project.preparation_at);
              break;
          case 'Negociación':
              $scope.maxDate = new Date($scope.action.project.negotiation_at);
              $scope.minDate = new Date($scope.action.project.preparation_at);
              break;
          case 'Ejecución':
              $scope.maxDate = new Date($scope.action.project.ejecution_at);
              $scope.minDate = new Date($scope.action.project.negotiation_at);
              break;          
          default:
              $scope.maxDate = new Date($scope.action.project.evaluation_at);
              $scope.minDate = new Date($scope.action.project.ejecution_at);
      }

    };

    $scope.getActionByIdInit = function() {
      ActionGetService.getById($state.params.id).then(
        function(response) {
          console.log('response', response);
          $scope.action = response;
          $scope.updateLimitDates();
        },
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
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

  		ActionUpdateService.update($state.params.id, action).then(
  			function(response) {
          if(action.parent_action)
            $state.go('actionDetail',{id:action.parent_action});
          else
  				  $state.go('projectDetail',{id:action.project});
  			},
  			function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
  	  	}
  		);

    }

}]);
