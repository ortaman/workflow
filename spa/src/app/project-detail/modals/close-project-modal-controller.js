
app.controller('CloseProjectModalController', ['$scope','$mdDialog','type', 'project','Notification', 'ActionService',
  function($scope,$mdDialog, type, project, Notification, ActionService) {

    var $ctrl = this;
    $ctrl.titles = {
      'project': {
        'type':'project',
       'name': 'proyecto',
       'theName': 'El proyecto',
      },
      'action':{
        'type':'action',
       'name': 'acción',
       'theName': 'La acción',
      }
    }

    $ctrl.titles = $ctrl.titles[type];
    $ctrl.project = project;
    $ctrl.submitted = false;

    $ctrl.closeProject = function(status){
      $ctrl.submitted = true;
      var project = angular.copy($ctrl.project);
      project.status = status;
      project.qualified_at = moment().format("YYYY-MM-DD");

      if (!status) {
        Notification.success('El formulario no es válido.');
        return;
      }
        $scope.submmitPromise = ActionService.patch(project.id, project).then(
          function (response) {
            $mdDialog.hide();
            if(type == 'project')
              Notification.success("El proyecto ha pasado a estatus de cerrado")
            else
              Notification.success("La acción ha pasado a estatus de cerrada")


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
