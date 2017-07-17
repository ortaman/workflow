
app.controller('AlertsController', ['$scope', 'AlertsService', 'Notification', '$state',
 function($scope, AlertsService, Notification, $state) {

   $scope.alerts = [];
   $scope.currentAlertPage = 1;

   $scope.init =function () {
     $scope.getAlerts();
   }

   $scope.getAlerts = function () {
     let query = {
       page: $scope.currentAlertPage
     }
     AlertsService.getList(query).then(
       function (response) {
         console.log(response);
         $scope.alerts = response;
       },
       function (error) {
         Notification.error("Ocurrio un  error, intente mas tarde");
       }
     );
   }

   $scope.isProject = function (obj) {
     obj.parent_action == null ? false : true;
   }

   $scope.updateAlert = function (alert) {
     alert.viewed = true;
     AlertsService.update(alert).then(
       function (response) {
         console.log(response);
         $state.go('projectDetail', {id:alert.action.id});
       },
       function(error){
         console.error(error);
         Notification.error("Ocurrio un  error, intente mas tarde");
       }
     )

   }
}]);
