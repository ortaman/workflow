
app.controller('ReportModalController', [ '$mdDialog','$state', 'ReportCreateService', 'UserService',
 function($mdDialog, $state, ReportCreateService, UserService) {
   var $ctrl = this;

    console.log($ctrl);
    $ctrl.submitted = false;
    $ctrl.report = {
      'project':$state.params.id,
      'progress':'0'
    }

    $ctrl.sendReport = function(){
      console.log($ctrl);
      $ctrl.submitted = true;

      if ($ctrl.reportForm.$invalid) {
        $ctrl.errors = 'El formulario no es válido.';
        return;
      }

      UserService.me().then(function(response){
        $ctrl.report.create_by = response.id

        ReportCreateService.create($ctrl.report).then(
          function (response) {
            $mdDialog.hide();

            console.log("response", response);
          },
          function (errorResponse) {
            console.log('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
          }
        );
      }, function(error){
        console.log("error",error);
      })
    }

    $ctrl.cancel = function () {
      $mdDialog.hide();
    };
}]);
