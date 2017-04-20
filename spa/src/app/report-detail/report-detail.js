
app.controller('ReportDetailController', ['$scope', '$mdDialog', 'report',function( $scope, $mdDialog, report) {
  console.log("detail" , report);
  var $ctrl = this;

  $ctrl.report = report;
  $ctrl.cancel = function () {
    $mdDialog.hide();
  };
}]);
