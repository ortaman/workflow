
app.controller('CalendarController', ['$scope','$compile','ProjectListService', 'ActionListService', function($scope, $compile, ProjectListService, ActionListService) {

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
   $scope.events = [];
   $scope.projects = {};

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


   $scope.eventsF = function (start, end, timezone, callback) {
     // TODO: cambiar  por filtrado sin paginador
     var query = {
       'begin_date': moment(start).format('YYYY-MM-DD'),
       'end_date': moment(end).format('YYYY-MM-DD')
     };

     ProjectListService.getList(query).then(
       function(response) {
          $scope.project = response;
          $scope.events.splice(0, $scope.events.length);
          addProjectToCalendar()
          getProjectActions();
          console.log("actions",$scope.actions);
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


   //functions
   var addProjectToCalendar = function(){
     angular.forEach($scope.projects, function(value, key){
       angular.forEach(dateFields,function(value2, key2){
         var item2 = {};
         item2.title = $scope.projects[key].name+ ' ('+ value2+')';
         item2.start = new Date($scope.projects[key][key2]);
         $scope.events.push(item2);
       })
     })
   }

   var getProjectActions = function() {
       var query = {
         "page": 1,
         "status": 'open',
         "project_id":$scope.project[0].id
       }
       ActionListService.getList(query).then(
         function(response) {
           $scope.actions = response;
         },
         function(errorResponse) {
           $scope.status = errorResponse.statusText || 'Request failed';
           $scope.errors = errorResponse.data;
         }
       );
   };


}]);
