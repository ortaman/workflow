
app.controller('ReportModalController', [ '$mdDialog','$state', 'ReportCreateService', 'UserService','type', 'reportType', '$scope','Notification',
 function($mdDialog, $state, ReportCreateService, UserService, type, reportType, $scope, Notification) {
   var $ctrl = this;
    $ctrl.reportTypeOptions = {
      "finish":{
        'name':'finish',
        'title':'Reporte de término '
      },
      "advance":{
        'name':'advance',
        'title':'Reporte de avance '
      }
    }
    $ctrl.reportTypeOptions = $ctrl.reportTypeOptions[reportType];

    $ctrl.submitted = false;
    $ctrl.report = {
      'progress':'25'
    }

    $ctrl.report[type] = $state.params.id;
    if(type == 'action'){
      $ctrl.report['project'] = $scope.currentAction.project.id;
    }

    $ctrl.sendReport = function(){
      $ctrl.submitted = true;

      if ($ctrl.reportForm.$invalid) {
        $ctrl.errors = 'El formulario no es válido.';
        return;
      }

      UserService.me().then(function(response){
        $ctrl.report.created_by = response.id

        $ctrl.submmitPromise = ReportCreateService.create($ctrl.report).then(
          function (response) {
            Notification.success("El proyecto ha pasado a estatus de terminado")
            $mdDialog.hide();

          },
          function (errorResponse) {
            console.error('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
          }
        );
      }, function(error){
        console.error("error",error);
      })
    }

    $ctrl.cancel = function () {
      $mdDialog.hide();
    };
}]);
