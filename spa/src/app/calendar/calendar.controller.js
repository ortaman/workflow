
app.controller('CalendarController', ['$scope','$compile','ProjectListService', function($scope, $compile, ProjectListService) {


   $scope.events = [];
   var today = moment();
   $scope.eventSources = [$scope.events];
   var dateFields = [
       'preparation_at',
       'negotiation_at',
       'execution_at',
       'evaluation_at',

       'accomplish_at',
       'expire_at',
       'renegotiation_at',
       'report_at',
       'begin_at',
   ];

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
            dateFields.forEach(function(item){
              var item2 = {};
              item2.title = response.results[key].name+ '('+ item+')';
              item2.start = new Date(response.results[key][item]);
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
