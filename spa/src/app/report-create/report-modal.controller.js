
app.controller('ReportModalController', [ '$mdDialog','$state', 'ReportService', 'UserService', 'reportType', '$scope','Notification',
 function($mdDialog, $state, ReportService, UserService,  reportType, $scope, Notification) {
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

    if($ctrl.reportTypeOptions.name =="advance"){
      $ctrl.report = {
        'progress':'25'
      }
    }else {
      $ctrl.report = {
        'progress':'100'
      }
    }


    $ctrl.report.action = $state.params.id;
    $ctrl.sendReport = function(){
      $ctrl.submitted = true;

      if ($ctrl.reportForm.$invalid) {
        $ctrl.errors = 'El formulario no es válido.';
        return;
      }

      UserService.me().then(function(response){
        $ctrl.report.created_by = response.id

        $ctrl.submmitPromise = ReportService.create($ctrl.report).then(
          function (response) {
            $mdDialog.hide({"created":true});

          },
          function (errorResponse) {
            console.error('errorResponse', errorResponse);
            Notification.error("Ocurrio un error")
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
