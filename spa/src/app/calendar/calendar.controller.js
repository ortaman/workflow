
app.controller('CalendarController', ['$scope','$compile','ProjectListService', 'ActionListService', function($scope, $compile, ProjectListService, ActionListService) {

  $scope.events = [];
  $scope.projects = {};
  $scope.actions = [];

  /* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false,
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
    }
  };

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
  var actionDateFields = {
      'accomplish_at':'Fecha de cumplimiento',
      'expire_at':'Fecha de expiración',
      'renegotiation_at':'Fecha de renegociación',
      'report_at':'Fecha de reporte',
      'begin_at':'Fecha de inicio',
    };

  $scope.init = function () {
    // TODO: cambiar  por filtrado sin paginador
    var query = {
      'begin_date': moment('2017-01-01').format('YYYY-MM-DD'),
      'end_date': moment('2017-11-11').format('YYYY-MM-DD'),
    };

    ProjectListService.getList(query).then(
      function(response) {
         $scope.projects = response;
      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

   $scope.eventsF = function (start, end, timezone, callback) {
     callback($scope.events)
   };
   $scope.eventSources = [$scope.eventsF, $scope.events];

   //functions
   var addToCalendar = function(array,dates){
     angular.forEach(array, function(value, key){
       angular.forEach(dates,function(value2, key2){
         var item2 = {};
         item2.title = array[key].name+ ' ('+ value2+')';
         item2.start = new Date(array[key][key2]);
         $scope.events.push(item2);
       })
     })
   }

   var getProjectActions = function(project) {
       var query = {
         "page": 1,
         "status": 'open',
         "project_id":project.id
       }
       ActionListService.getList(query).then(
         function(response) {
           var actions = response.results;
           addToCalendar(actions,actionDateFields);
         },
         function(errorResponse) {
           $scope.status = errorResponse.statusText || 'Request failed';
           $scope.errors = errorResponse.data;
         }
       );
   };
  //events
  $scope.onProjectSelect =  function (project) {
    $scope.events.splice(0,$scope.events.length);
    console.log($scope.events);
    var array = [];
    project = JSON.parse(project);
    array.push(project);
    addToCalendar(array,dateFields);
    getProjectActions(project)
  }

}]);
