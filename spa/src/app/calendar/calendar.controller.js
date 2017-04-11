
app.controller('CalendarController', ['$scope','$compile','ProjectListService', function($scope, $compile, ProjectListService) {


   $scope.events = [];
   var today = moment();
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



   };

   $scope.eventsF = function (start, end, timezone, callback) {

     var query = {
       'begin_date': moment(start).format('YYYY-MM-DD'),
       'end_date': moment(end).format('YYYY-MM-DD')

     };

     ProjectListService.getList(query).then(
       function(response) {
          console.log('ProjectList', response);

          $scope.events.splice(0, $scope.events.length);

          angular.forEach(response, function(value, key){
            angular.forEach(dateFields,function(value2, key2){
              var item2 = {};
              item2.title = response[key].name+ ' ('+ value2+')';
              item2.start = new Date(response[key][key2]);
              $scope.events.push(item2);
            })

          })
          callback($scope.events);

       },
       function(errorResponse) {
         console.log('errorResponse', errorResponse);
         $scope.status = errorResponse.statusText || 'Request failed';
         $scope.errors = errorResponse.data;
       }
     );
   };
   $scope.eventSources = [$scope.eventsF];




}]);
