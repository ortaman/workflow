
app.controller('CalendarController', ['$scope','$compile','ProjectListService', function($scope, $compile, ProjectListService) {


   $scope.events = [];
   var today = moment();
   $scope.eventSources = [$scope.events];
   var dateFields = {
       'preparation_at':'Fecha de preparación',
       'negotiation_at':'Fecha de negociación',
       'execution_at':'Fecha de ejecución',
       'evaluation_at':'Fecha de evaluación',

       'accomplish_at':'Fecha de cumplimiento',
       'expire_at':'Fecha de expiración',
       'renegotiation_at':'Fecha de renegociación',
       'report_at':'Fecha de reporte',
       'begin_at':'Fecha de inicio',
   };

   /* config object */
   $scope.uiConfig = {
     calendar:{
       height: 450,
       editable: false,
       header:{
         left: 'title',
         center: '',
         right: 'today prev,next'
       },
     }
   };
   /* event sources array*/

   $scope.dateChanged = function() {

     var query = {
       'begin_date': today.startOf('month').format('YYYY-MM-DD'),
       'end_date': today.endOf('month').format('YYYY-MM-DD')
     };

     ProjectListService.getList(query).then(
       function(response) {

          $scope.events.splice(0, $scope.events.length);

          angular.forEach(response.results, function(value, key){
            angular.forEach(dateFields,function(value2, key2){
              var item2 = {};
              item2.title = response.results[key].name+ ' ('+ value2+')';
              item2.start = new Date(response.results[key][key2]);
              $scope.events.push(item2);
            })

          })
       },
       function(errorResponse) {
         console.log('errorResponse', errorResponse);
         $scope.status = errorResponse.statusText || 'Request failed';
         $scope.errors = errorResponse.data;
       }
     );

   };
   $scope.dateChanged();


}]);
