
app.controller('CoordinationsModalController', ['$scope','$mdDialog','currentAction','ActionListService',
  function($scope,$mdDialog, currentAction, ActionListService) {
    console.log(currentAction);
    var $ctrl = this;
    $ctrl.currentAction = currentAction;
    $ctrl.actionCurrentPage = 1
    var actionStatus = "Abierta"

    $ctrl.actionPageChanged = function(status) {
      console.log("kkkkk");
  		actionStatus = status||actionStatus;

       	var query = {
  			"parent_action_id": $ctrl.currentAction.id,
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

    $ctrl.actionPageChanged()
}]);
