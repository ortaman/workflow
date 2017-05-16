
app.controller('CloseActionModalController', ['$scope','$mdDialog','action','Notification', 'ActionCreateService',
  function($scope,$mdDialog, action, Notification, ActionCreateService) {

    var $ctrl = this;
    $ctrl.action = action;
    $ctrl.submitted = false;

    $ctrl.closeProject = function(status){
      $ctrl.submitted = true;
      var action = angular.copy($ctrl.action);
      action.status = status
      if (!status) {
        Notification.success('El formulario no es válido.');
        return;
      }
        $scope.submmitPromise = ActionCreateService.update(action.id, action).then(
          function (response) {
            $mdDialog.hide();
            Notification.success("El proyecto ha pasado a estatus de cerrado")

          },
          function (errorResponse) {
            console.error('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
          }
        );

    }

    $ctrl.cancel = function () {
      $mdDialog.hide();
    };
}]);
