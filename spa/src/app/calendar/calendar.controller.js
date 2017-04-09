
app.controller('CalendarController', ['$scope','$compile','ProjectListService', function($scope, $compile, ProjectListService) {

  var date = new Date();
   var d = date.getDate();
   var m = date.getMonth();
   var y = date.getFullYear();


   /* event source that contains custom events on the scope */
   $scope.events = [

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
   $scope.eventSources = [$scope.events];

   $scope.dateChanged = function() {

     var query = {
       'begin_date':'2017-02-20',
       'end_date':'2019-02-20'
     };

     ProjectListService.getList(query).then(
       function(response) {


         $scope.events = response.results;

         angular.forEach($scope.events, function(value, key){
           console.log($scope.events[key])
           $scope.events[key].title = $scope.events[key].name;
           $scope.events[key].start =  new Date(y, m, d - 3, 16, 0);
         })
         console.log('ProjectList', $scope.events);


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
