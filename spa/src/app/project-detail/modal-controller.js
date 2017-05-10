
app.controller('CoordinationsModalController', ['$scope','$mdDialog','currentAction','ActionListService','ActionGetService',
  function($scope,$mdDialog, currentAction, ActionListService, ActionGetService) {

    var $ctrl = this;
    $ctrl.action = currentAction;
    $ctrl.actionCurrentPage = 1
    var actionStatus = "Abierta"
    $ctrl.accomplishedStatus = 'Terminada'


    $ctrl.init = function () {
      $ctrl.getAction();
      $ctrl.actionPageChanged()
    }
    $ctrl.actionPageChanged = function(status) {
  		actionStatus = status||actionStatus;

       	var query = {
  			"parent_action_id": currentAction,
  			"page": $ctrl.actionCurrentPage,
  			"status": actionStatus,
  		};

  		ActionListService.getList(query).then(
  			function(response) {
  				$ctrl.actions = response;
  				console.log("actions", response);
  			},
  			function(errorResponse) {
  				$ctrl.status = errorResponse.statusText || 'Request failed';
  				$ctrl.errors = errorResponse.data;
  			}
  		);

    };

    $ctrl.getAction = function () {
      ActionGetService.getById($ctrl.action).then(
        function(response) {
          $ctrl.action = response;
        },
        function(errorResponse) {
            console.log('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
        }
      );
    }

    $ctrl.getColor = function(phase){
        if($ctrl.action.phase == phase){
          return $ctrl.action.color+ "-status"
      }
    }
}]);
