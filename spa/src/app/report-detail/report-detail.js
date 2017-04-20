
app.controller('ReportDetailController', [ 'ReportGetService', '$state', '$mdDialog',function( ReportGetService, $state, $mdDialog) {
  console.log("detail" );
  var $ctrl = this;

  $ctrl.report = {};

  $ctrl.init = function(){
    var reportId = $state.params.id
    $ctrl.getReport(reportId);
  }

  $ctrl.getReport = function (reportId){
    var query = {
      project_id: reportId,
      action_id:'None'
    }
    ReportGetService.getList(query).then(
      function(response){
        $ctrl.report = response[0]
        console.log(response);
      }, function(errors){
        console.log(errors);
      });
  }
  $ctrl.cancel = function () {
    $mdDialog.hide();
  };
}]);
