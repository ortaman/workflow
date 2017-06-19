
app.controller('CloseProjectModalController', ['$scope','$mdDialog','project','Notification', 'ActionService',
  function($scope,$mdDialog, project, Notification, ActionService) {

    var $ctrl = this;
    $ctrl.project = project;
    $ctrl.submitted = false;

    $ctrl.closeProject = function(status){
      $ctrl.submitted = true;
      var project = angular.copy($ctrl.project);
      project.status = status
      if (!status) {
        Notification.success('El formulario no es válido.');
        return;
      }
        $scope.submmitPromise = ActionService.patch(project.id, project).then(
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
