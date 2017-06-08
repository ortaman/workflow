
app.controller('CalendarController', ['$scope','$compile','ActionService', function($scope, $compile, ActionService) {

  $scope.projects = {};
  $scope.actionEvents = [];
  $scope.projectEvents = [];
  $scope.calendarCurrentDates = {}


  $scope.eventRender = function( event, element, view ) {
    element.attr({'uib-tooltip': event.title,
                 'uib-tooltip-append-to-body': true});
    $compile(element)($scope);
  };

  /* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false,
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      eventRender: $scope.eventRender
    }
  };

  var dateFields = {
      'preparation_at':'Fecha de preparación',
      'negotiation_at':'Fecha de negociación',
      'execution_at':'Fecha de ejecución',
      'evaluation_at':'Fecha de evaluación',

      'accomplish_at':'Fecha de ejecución',
      'expire_at':'Fecha de expiración',
      'renegotiation_at':'Fecha de renegociación',
      'report_at':'Fecha de reporte',
      'begin_at':'Fecha de inicio',
  };

  var actionDateFields = {
      'accomplish_at':'Fecha de ejecución',
      'report_at':'Fecha de reporte',
      'begin_at':'Fecha de inicio',
    };

  $scope.init = function () {
    var query = {
    };

    ActionService.getList(query).then(
      function(response) {
         $scope.projects = response;
      },
      function(errorResponse) {
        console.error('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

   $scope.eventsF = function (start, end, timezone, callback) {
     $scope.calendarCurrentDates = {
       "begin_date":start,
       "end_date":end
     }
     if($scope.calendarForm)
      {
        var project = JSON.parse($scope.calendarForm.project);
        getProjectActions(project)
      }
     callback()
   };
   $scope.eventSources = [$scope.eventsF,$scope.actionEvents, $scope.projectEvents];

   //functions
   var addToCalendar = function(array,dates,type){
     angular.forEach(array, function(value, key){
       angular.forEach(dates,function(value2, key2){
         var item2 = {};
         item2.title = array[key].name+ ' - '+ value2;
         item2.start = moment(array[key][key2]).toDate();
         item2.stick = true
         item2.className = getColor(value, key2, type);
         if(type=="actions"){
           $scope.actionEvents.push(item2);
         }else {
           $scope.projectEvents.push(item2);
         }
       })
     })
   }

   var getProjectActions = function(project) {
       var query = {
         "page": 1,
         'begin_date': moment($scope.calendarCurrentDates.begin_date).format('YYYY-MM-DD'),
         'end_date': moment($scope.calendarCurrentDates.end_date).format('YYYY-MM-DD'),
         "project_id":project.id
       }
       ActionService.getList(query).then(
         function(response) {
           $scope.actionEvents.splice(0,$scope.actionEvents.length);

           var actions = response;
           addToCalendar(actions,actionDateFields, 'actions');
         },
         function(errorResponse) {
           $scope.status = errorResponse.statusText || 'Request failed';
           $scope.errors = errorResponse.data;
         }
       );
   };
  //events
  $scope.onProjectSelect =  function (project) {
    $scope.projectEvents.splice(0,$scope.projectEvents.length);
    var array = [];
    project = JSON.parse(project);
    array.push(project);
    addToCalendar(array,dateFields, 'project');
    getProjectActions(project)
  }

  var getColor = function (action, value, type){

    return action['color'] + '-status';
  }
}]);
