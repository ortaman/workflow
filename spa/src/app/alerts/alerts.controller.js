
app.controller('AlertsController', ['$scope', 'AlertsService', 'Notification',
 function($scope, AlertsService, Notification) {


   AlertsService.getList({}).then(
     function (response) {
       console.log(response);
     },
     function (error) {
       Notification.error("Ocurrio un  error, intente mas tarde");
     }
   )

}]);
