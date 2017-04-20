
app.controller('ReportModalController', [ '$mdDialog','$state', 'ReportCreateService', 'UserService','type','$scope',
 function($mdDialog, $state, ReportCreateService, UserService, type,  $scope) {
   var $ctrl = this;

    $ctrl.submitted = false;
    $ctrl.report = {
      'progress':'0'
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
