
"use strict";

var app = angular.module('myApp',
  [
		'ui.router',
		'ngMaterial',
    'ngDialog',
    'ui.bootstrap',
    'ui.calendar',
    'angularPromiseButtons',
    'ui-notification'

    // 'myApp.actionList',
  ]
);

app.run(function($http, $rootScope, $location, StorageService, UserService) {

  $http.defaults.headers.common['Accept'] = 'application/json';
  $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';

  if (StorageService.get('token')) {
    $http.defaults.headers.common.Authorization = 'Token ' + StorageService.get('token');
  }

});

if(window.location.hash === '#_=_') window.location.hash = '#!';

app.config(function (angularPromiseButtonsProvider)
{
  angularPromiseButtonsProvider.extendConfig({
     spinnerTpl: '<i  style="display: none;" class=" btn-spinner fa fa-circle-o-notch fa-spin"></i>',
  });
})


app.constant('APIConfig', {
  url: 'http://localhost:9000/api/',
  baseUrl: 'http://localhost:9000/',
});


app.constant('URLTemplates', (function() {
  var debug = true;
	if (debug) 
		return '';

	return 'static/';
})());



app.config(function($stateProvider, $urlRouterProvider, URLTemplates,
  $mdThemingProvider, $mdDateLocaleProvider) {

  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: URLTemplates + "app/login/login.html",
      controller: "LoginController"
    })
    .state('profile', {
      url: "/profile",
      templateUrl: URLTemplates + "app/profile/profile.html",
      controller: "ProfileController"
    })
    .state('coordinations', {
      url: "/coordinations",
      templateUrl: URLTemplates + "app/coordinations/coordinations.html",
      controller: "CoordinationsController"
    })


    .state('projectCreate', {
      url: "/projectCreate",
      templateUrl: URLTemplates + "app/project-create/project-create.html",
      controller: "ProjectCreateController"
    })
    .state('projectList', {
      url: "/projectList",
      templateUrl: URLTemplates + "app/project-list/project-list.html",
      controller: "ProjectListController"
    })
    .state('projectDetail', {
      url: "/projectDetail/:id/",
      templateUrl: URLTemplates + "app/project-detail/project-detail.html",
      controller: "ProjectDetailController"
    })
    .state('projectUpdate', {
      url: "/projectUpdate/:id/",
      templateUrl: URLTemplates + "app/project-update/project-update.html",
      controller: "ProjectUpdateController"
      //resolve: {
        //project: function (ProjectUpdateService) {
          //return ProjectUpdateService.getById(1);
        //}
      //}
    })

    .state('actionCreate', {
      url: "/actionCreate/:projectId/:actionId/",
      templateUrl: URLTemplates + "app/action-create/action-create.html",
      controller: "ActionCreateController"
    })
    .state('actionDetail', {
      url: "/actionDetail/:id/",
      templateUrl: URLTemplates + "app/action-detail/action-detail.html",
      controller: "ActionDetailController"
    })
    .state('actionUpdate', {
      url: "/actionUpdate/:id/",
      templateUrl: URLTemplates + "app/action-update/action-update.html",
      controller: "ActionUpdateController"
    })
    .state('actionList', {
      url: "/actionList",
      templateUrl: "app/action-list/action-list.html",
      controller: "ActionListController",
    })
    .state('calendar', {
      url: "/calendar",
      templateUrl: "app/calendar/calendar.html",
      controller: "CalendarController",
    })
    .state('reportDetail', {
      url: "/reportDetail/:id/",
      templateUrl: "app/report-detail/report-detail.html",
      controller: "ReportDetailController",
    })

    .state('userList', {
      url: "/userList",
      templateUrl: "app/user-list/user-list.html",
      controller: "UserListController",
    })
    .state('userCreate', {
      url: "/userCreate/:id",
      templateUrl: "app/user-create/user-create.html",
      controller: "UserCreateController",
    })

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/coordinations");

  $mdThemingProvider.theme('default')
    .primaryPalette('blue');

  $mdDateLocaleProvider.formatDate = function(date) {
    return date ? moment(date).format('DD-MM-YYYY') : '';
  };

  $mdDateLocaleProvider.parseDate = function(dateString) {
    var m = moment(dateString, 'DD-MM-YYYY', true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };

});


app.service('StorageService', function($window) {

    this.set = function(key, token) {

      if ($window.localStorage) {
        $window.localStorage.setItem(key, token);  
      }
      else {
        alert('LocalStorage no soportado por el navegador!');
      }

    };

    this.get = function(key) {
      return $window.localStorage.getItem(key) || false;
    };

    this.remove = function(key) {
      $window.localStorage.removeItem(key);
    }

    this.clear = function(){
      $window.localStorage.clear();
    }
 
});

app.controller('ActionCreateController', [
  '$scope', '$state', 'ProjectListService', 'ActionCreateService', 'ProjectGetService', 'ActionGetService','Notification',
  function($scope, $state, ProjectListService, ActionCreateService, ProjectGetService, ActionGetService, Notification) {

  $scope.action = {};
  $scope.submitted = false;
  $scope.projectId = $state.params.projectId.toString();
  $scope.actionId = $state.params.actionId.toString();

  $scope.updateDates = function() {

    switch($scope.action.phase) {
        case 'Preparación':
            $scope.minDate = new Date($scope.project.begin_at);
            $scope.maxDate = new Date($scope.project.preparation_at);
            break;
        case 'Negociación':
            $scope.maxDate = new Date($scope.project.negotiation_at);
            $scope.minDate = new Date($scope.project.preparation_at);
            break;
        case 'Ejecución':
            $scope.maxDate = new Date($scope.project.ejecution_at);
            $scope.minDate = new Date($scope.project.negotiation_at);
            break;
        default:
            $scope.maxDate = new Date($scope.project.evaluation_at);
            $scope.minDate = new Date($scope.project.ejecution_at);
    }

  };

  $scope.init = function() {
    $scope.getProject();
    if($scope.actionId)
      $scope.getParentAction($scope.actionId);
  }

  $scope.submit = function (_action) {
    $scope.submitted = true;

    if ($scope.actionForm.$invalid) {
      Notification.error('El formulario contiene errores');
      console.log($scope.actionForm);
      return;
    }

    var action = angular.copy(_action);
    action.project = $scope.projectId;
    action.client = $scope.project.producer.id;
    if($scope.actionId)
      action.parent_action = $scope.actionId;

    $scope.submmitPromise = ActionCreateService.create(action).then(
      function (response) {
        Notification.success('La accion ha sido creada satisfactoriamente');

        if($scope.actionId)
          $state.go('actionDetail', {id:$scope.actionId})
        else
          $state.go('projectDetail', {id:$scope.project.id})
      },
      function (errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );

  }


  $scope.getProject = function(){
    ProjectGetService.getById($state.params.projectId).then(
      function(response) {
        console.log('ProjectGet', response);
        $scope.project = response;

        $scope.action.project = $scope.project.name;
        $scope.action.client = $scope.project.producer.name + " "+ $scope.project.producer.first_surname + " " + $scope.project.producer.second_surname;
        $scope.action.phase = $scope.project.phase;
        $scope.updateDates();
      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.getParentAction = function(id){
    ActionGetService.getById(id).then(
      function(response) {

        $scope.action.parent_action = response;
        console.log('actiontGet', $scope.action);

      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }
}]);


app.service("ActionCreateService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.create = function(object) {

        var transformFields = [
            'begin_at',
            'accomplish_at',
            'report_at',
        ];

        angular.forEach(object, function(value, key) {
            transformFields.forEach(function(item) {

            if(key == item)
                object[key] = new moment(value).format("YYYY-MM-DD");
            })
        });

        var promise = $http.post(APIConfig.url + "actions/", object).then(function(response) {
            return response;
        });

        return promise;
    };


    this.update = function(id,object) {
      var transformFields = ['project', 'producer', 'client', 'observer'];
      var transformDateFields = ['accomplish_at','begin_at', 'report_at'];

        angular.forEach(transformFields, function(item){
          if (object[item] && typeof object[item] != 'number')
              object[item] = object[item].id
        })
        angular.forEach(transformDateFields, function(item){
              object[item] = moment(object[item]).format('YYYY-MM-DD')
        })

        var promise = $http.patch(APIConfig.url + "actions/"+id+"/", object).then(function(response) {
            return response;
        });

        return promise;
    };

}]);


app.controller('ActionDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig',
	'ProducerGetListService', 'ActionGetService','ReportGetService','$mdDialog',
	'ActionCreateService', 'UserService', 'Notification',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig,
		ProducerGetListService, ActionGetService, ReportGetService, $mdDialog, ActionCreateService, UserService, Notification) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	var actionStatus = "Creada"
	$scope.accomplishedStatus = 'Terminada'

	$scope.currentAction = {};
	$scope.project = {};
	$scope.producers = [];

  $scope.init = function() {
		UserService.me().then(function(response){
			$scope.user = response
		}, function(error){
			console.error("error",error);
		})
		$scope.getAction();
		$scope.actionPageChanged()
		$scope.producerPageChanged($scope.producersPerformanceCurrentPage, 'producers');
		$scope.producerPageChanged($scope.producersCurrentPage, 'producersPerformance');
		$scope.getReport();
	}

	//Service calls
	$scope.getAction = function() {
		ActionGetService.getById($state.params.id).then(
			function(response) {
				$scope.currentAction = response;
				console.log("imagen", response);
			},
			function(errorResponse) {
					console.log('errorResponse', errorResponse);
					$scope.status = errorResponse.statusText || 'Request failed';
					$scope.errors = errorResponse.data;
			}
		);
	}


	//////////////////////////////////////////////  reports////////////////////////////////////////

	$scope.getReport = function (){
    var query = {
      action_id:$state.params.id
    }
    ReportGetService.getList(query).then(
      function(response){
         $scope.report = response[response.length-1]
      }, function(errors){
        console.log(errors);
      });
  }

	$scope.openReportModal = function() {

		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-create/add-report.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 reportType: 'advance',
			 type:'action'
		 }
		}).then(function (obj) {
 		 if(obj.created == true){
 			 Notification.success("Se ha reportado el avance")
 			 $scope.currentAction.status = 'Reportada'
 		 }

 	 }).finally(function() {
			$scope.getReport()
		});
	}

	$scope.openReportDetailModal = function() {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportDetailController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-detail/report-detail.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 report: $scope.report
		 }
		})

	}

	$scope.actionFinishReport = function(){
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-create/add-report.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 type:'action',
			 reportType:'finish',
		 }
	 }).then(function (obj) {
		 if(obj.created == true){
			 Notification.success("La acción ha pasado a estatus de terminada")
			 $scope.currentAction.status = 'Terminada'
		 }

	 }).finally(function(response) {
      	$scope.getReport()
    });
	}

	////////////////////////////////////////////// end reports////////////////////////////////////////

	////////////////////////////////////////////// modals////////////////////////////////////////

	$scope.closeAction = function(){
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'CloseActionModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/action-detail/modals/close-action-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 action: $scope.currentAction
		 }
		}).finally(function() {

    });
	}



	//////////////////////////////////////////////end modals////////////////////////////////////////

	$scope.actionPageChanged = function(status) {
		actionStatus = status||actionStatus;

     	var query = {
			"parent_action_id": $state.params.id,
			"page": $scope.actionCurrentPage,
			"status": actionStatus,
		};

		ActionListService.getList(query).then(
			function(response) {
				$scope.actions = response;
				console.log("actions", response);
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	$scope.producerPageChanged = function(page, list) {

	  	var query = {
	  		"page": page,
	  		"parent_action_id": $state.params.id,
	  	};

		ProducerGetListService.getList(query).then(
			function(response) {
				$scope[list] = response;

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

  };

	//////////////////////////////////////////////template interaction functions////////////////////////////////////////
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index){
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);

	}

	$scope.getColor = function(phase){
			if($scope.currentAction.phase == phase){
				return 'bg-info '+ $scope.currentAction.color +'-status'
		}
	}
	//////////////////////////////////////////////template interaction functions////////////////////////////////////////

}]);


app.service("ActionGetService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.getById = function(id) {

      var statusList = ['Terminada', 'Satisfactoria',  'Insatisfactoria']

      var getColor = function (project) {

  				if(moment(project.accomplish_at).isBefore(moment())){
  					angular.forEach(statusList, function(status){
  						if (project.status == status)
  							return 'green'
  					})

  					if(project.report == 0 )
  						return 'red';
  				}

  				else if(moment(project.report_at).isBefore(moment()))
  					return 'green';

  				else if(moment(project.report_at).isBefore(moment()) && project.report == 0 )
  					return 'yellow';

  			return 'green'
  		}

        var promise = $http.get(APIConfig.url + "actions/" + id + "/").then(function(response) {

            var transformFields = [
                'accomplish_at',
                'expire_at',
                'renegotiation_at',
                'report_at',
                'begin_at'
            ];
            angular.forEach(response.data, function(value, key) {
                transformFields.forEach(function(item) {
                    if(key == item) {
                        var d = new Date(value);
                        response.data[key] = new Date(d.getTime() + d.getTimezoneOffset() *60*1000);
                    }
                })
            });

            response.data.color = getColor(response.data);

            response.data.producer.photo = APIConfig.baseUrl + response.data.producer.photo;
            response.data.client.photo = APIConfig.baseUrl + response.data.client.photo;
    				response.data.project.image = APIConfig.baseUrl + response.data.project.image;

            return response.data;
        });

        return promise;
    }



}]);


app.controller('ActionListController', ['$scope', 'ActionListService', 'ProducerGetListService','ProjectListService',
 function($scope, ActionListService, ProducerGetListService, ProjectListService) {

   $scope.producersCurrentPage = 1;
   $scope.producers = []
   $scope.projects = [];

   $scope.init = function () {
     $scope.producerPageChanged();
     $scope.getProjects();
   }

  	$scope.producerPageChanged = function() {
        var query = {
          "page": $scope.producersCurrentPage,
  	  		"project_id":$scope.selectedProject ,
  	  		"parent_action": "none",
  	  	};
        if($scope.selectedProject){
          ProducerGetListService.getList(query).then(
            function(response) {
              console.log("respue", response);
              $scope.producers = response

            },
            function(errorResponse) {
              $scope.status = errorResponse.statusText || 'Request failed';
              $scope.errors = errorResponse.data;
            }
          );
        }

    };

    $scope.onProjectSelect =  function (project) {
      $scope.selectedProject = project;
      $scope.producerPageChanged(project);

    }

    $scope.getProjects = function(){
      var query = {}
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

    //get
    $scope.getPercentage = function (producer) {
      var result = 0 ;
      console.log(producer);
      result = (producer.satisfactories*100)/(producer.open+ producer.unsatisfactories+ producer.satisfactories)
      result = result  == 'NaN' ? result:0;
      return result;
    }
}]);


app.service("ActionListService", ['$http', 'APIConfig', function($http, APIConfig) {

	var statusList = ['Terminada', 'Satisfactoria',  'Insatisfactoria']

	var getColor = function (project) {

			if(moment(project.accomplish_at).isBefore(moment())){
				angular.forEach(statusList, function(status){
					if (project.status == status)
						return 'green'
				})

				if(project.report == 0 ){
					return 'red';}
			}

			else if(moment(project.report_at).isBefore(moment()))
				return 'green';

			else if(moment(project.report_at).isBefore(moment()) && project.report == 0 )
				return 'yellow';

		return 'green'
	}

	this.getList = function(object) {
		var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/?" + params).then(function(response) {
			angular.forEach(response.data.results, function(item){

				item.project.image = APIConfig.baseUrl+ item.project.image;
				item.producer.photo = APIConfig.baseUrl+ item.producer.photo;
				item.client.photo = APIConfig.baseUrl+ item.client.photo;
				console.log(item);
				item.color = getColor(item);
			})

			if(response.data.length){
				angular.forEach(response.data, function (project) {
					project.color = getColor(project);
				})
			}
	  return response.data;
	});
	  return promise;
	};

}]);


app.controller('ActionUpdateController', [
  '$scope', '$state','ActionGetService', 'ActionUpdateService','Notification',
  function($scope, $state, ActionGetService, ActionUpdateService, Notification) {

    $scope.submitted = false;
    $scope.action = {};

    $scope.updateLimitDates = function() {

      switch($scope.action.phase) {
          case 'Preparación':
              $scope.minDate = new Date($scope.action.project.begin_at);
              $scope.maxDate = new Date($scope.action.project.preparation_at);
              break;
          case 'Negociación':
              $scope.maxDate = new Date($scope.action.project.negotiation_at);
              $scope.minDate = new Date($scope.action.project.preparation_at);
              break;
          case 'Ejecución':
              $scope.maxDate = new Date($scope.action.project.ejecution_at);
              $scope.minDate = new Date($scope.action.project.negotiation_at);
              break;
          default:
              $scope.maxDate = new Date($scope.action.project.evaluation_at);
              $scope.minDate = new Date($scope.action.project.ejecution_at);
      }

    };

    $scope.getActionByIdInit = function() {
      ActionGetService.getById($state.params.id).then(
        function(response) {
          console.log('response', response);
          $scope.action = response;
          $scope.updateLimitDates();
        },
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
      );
    }

    $scope.submit = function() {
      $scope.submitted = true;

      if ($scope.actionForm.$invalid) {
        Notification.error('El formulario contiene errores');
        return;
      }

      var action = angular.copy($scope.action);

  		$scope.submmitPromise = ActionUpdateService.update($state.params.id, action).then(
  			function(response) {
          Notification.success('La acción ha sido actualizada');

          if(action.parent_action)
            $state.go('actionDetail',{id:action.parent_action});
          else
  				  $state.go('projectDetail',{id:action.project});
  			},
  			function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
  	  	}
  		);

    }

}]);


app.service("ActionUpdateService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.update = function(id, object) {

        if(typeof(object.project) != Number)
            object.project = object.project.id;

        if(typeof(object.client) != Number)
            object.client = object.client.id;

        if(object.parent_action && typeof(object.parent_action) != Number)
            object.parent_action = object.parent_action.id;

        var transformFields = [
            'begin_at',
            'accomplish_at',
            'report_at',
        ];

        angular.forEach(object, function(value, key) {
            transformFields.forEach(function(item) {
                if(key == item)
                    object[key] = new moment(value).format("YYYY-MM-DD");
            })
        });

        var promise = $http.put(APIConfig.url + "actions/" + id + "/" , object).then(function(response) {
            return response.data;
        });

        return promise;

    };

}]);


app.controller('CalendarController', ['$scope','$compile','ProjectListService', 'ActionListService', function($scope, $compile, ProjectListService, ActionListService) {

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

      'accomplish_at':'Fecha de cumplimiento',
      'expire_at':'Fecha de expiración',
      'renegotiation_at':'Fecha de renegociación',
      'report_at':'Fecha de reporte',
      'begin_at':'Fecha de inicio',
  };

  var actionDateFields = {
      'accomplish_at':'Fecha de cumplimiento',
      'report_at':'Fecha de reporte',
      'begin_at':'Fecha de inicio',
    };

  $scope.init = function () {
    var query = {
    };

    ProjectListService.getList(query).then(
      function(response) {
         $scope.projects = response;
         console.log(response);
      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
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
         console.log(value);
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
       ActionListService.getList(query).then(
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


app.controller('CoordinationsController', ['$scope','ActionListService','UserService','ActionCreateService','$mdDialog',
  'APIConfig','ProjectListService','ProjectCreateService' , 'StadisticsService', 'Notification',
  function($scope, ActionListService, UserService, ActionCreateService, $mdDialog, APIConfig, ProjectListService, ProjectCreateService,
     StadisticsService, Notification) {

  $scope.promisesCurrentPage = 1
  $scope.ordersCurrentPage = 1

  $scope.producerFiltertype;
  $scope.clientFiltertype;

  $scope.promises = [];
  $scope.user;
  $scope.type = 'project',

  $scope.init = function(){
    UserService.me().then(function(response){
      $scope.user = response.id
      $scope.getProjectsByProducer('Creada' );
      $scope.getProjectsByClient('Creada' );
      $scope.getStadistics();
    }, function(error){
      console.error("error",error);
    })
  }

  $scope.getClients = function(status, typeOfFilter, page=1){
    var query = {
      page:page,
      status: status
    };


    $scope.clientStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    $scope.promisesByClientPromise = ActionListService.getList(query).then(
      function(response) {
          $scope.promises = response;
      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.getProducers = function(status, page=1){
    var query = {
      page:page,
      status:status
    };

    $scope.producerStatus = status // status for display button according the promise
    query.client = $scope.user; // id usuario

    $scope.ordersByProducerPromise = ActionListService.getList(query).then(
      function(response) {
          $scope.orders = response;
      },
      function(errorResponse) {
        $scope.status = errorResponse.statusText || 'Request failed';
        $scope.errors = errorResponse.data;
      }
    );
  }

  $scope.getProjectsByProducer = function(status, page=1){
    $scope.projectsByProducer = []

    var query = {
      page:page,
      status:status
    };

    $scope.projectProducerStatus = status // status for display button according the promise
    query.producer = $scope.user; // id usuario

    $scope.projectsProducerPromise = ProjectListService.getList(query).then(
			function(response) {
				$scope.projectsByProducer = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  }

  $scope.getProjectsByClient = function(status, page=1){
    var query = {
      page:page,
      status:status
    };
    $scope.projectClientStatus = status // status for display button according the promise
    query.client = $scope.user; // id usuario

    $scope.projectsClientPromise = ProjectListService.getList(query).then(
			function(response) {
				$scope.projectsByClient = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  }


  $scope.producerPageChanged = function () {
    $scope.producerStatus
    $scope.promisesCurrentPage = 1

  }

  $scope.getPhoto = function (obj) {
    angular.forEach(obj, function(item){
      item.project.image =  angular.copy(APIConfig.baseUrl+ item.project.image)
      item.producer.photo =  angular.copy(APIConfig.baseUrl+ item.producer.photo)
      item.client.photo =  angular.copy(APIConfig.baseUrl+ item.client.photo)
    })
  }

  ///////////////////////////////////////Action buttons methods/////////////////////////////////////////////

  $scope.makeActionProducerProject = function(project,type){
    var actionType = {
      'Aceptada':'aceptar',
      'Terminada':'terminar',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type]+" este proyecto?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      project.status = type
      Notification.info('Espere un momento');
      ProjectCreateService.update(project.id,project).then(
        function (response) {
          if (type == "Aceptada")
            Notification.success('El proyecto ha pasado a proyectos aceptados');
          else if (type == "Terminada")
            Notification.success('El proyecto ha pasado a proyectos terminados');
          $scope.getProjectsByProducer($scope.projectProducerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }

  $scope.makeProducerActionProject = function(project,type){
    var actionType = {
      'Satisfactoria':'satisfactorio',
      'Insatisfactoria':'insatisfactorio',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere calificar este proyecto como "+ actionType[type]+" ?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      project.status = type
      Notification.info('Espere un momento');

      ProjectCreateService.update(project.id,project).then(
        function (response) {
          if (type == "Satisfactoria")
            Notification.success('El proyecto ha pasado a proyectos cumplidos satisfactoriamente');
          else if (type == "Insatisfactoria")
            Notification.success('El proyecto ha pasado a proyectos cumplidos insatisfactoriamente');

          $scope.getProjectsByClient($scope.producerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }

  $scope.makeProducerAction = function(action,type){
    var actionType = {
      'Satisfactoria':'satisfactoria',
      'Insatisfactoria':'insatisfactoria',
    }
    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere calificar esta acción como "+ actionType[type]+" ?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
      action.status = type
      Notification.info('Espere un momento');
      ActionCreateService.update(action.id,action).then(
        function (response) {
          if (type == "Satisfactoria")
            Notification.success('La acción ha pasado a acciones cumplidas satisfactoriamente');
          else if (type == "Insatisfactoria")
            Notification.success('La acción ha pasado a acciones cumplidas insatisfactoriamente');
          $scope.getProducers($scope.producerStatus);
        },
        function (errors) {
          console.error(errors);
        }
      )
    }, function() {
    });
  }

  $scope.makeClientAction = function(action,type){
    var actionType = {
      'Aceptada':'aceptar',
      'Terminada':'terminar',
    }

    var confirm = $mdDialog.confirm()
        .title("¿Está seguro que quiere "+ actionType[type]+" esta accion?")
        .ok('Sí')
        .cancel('No');

    $mdDialog.show(confirm).then(function() {
        action.status = type
        Notification.info('Espere un momento');
        ActionCreateService.update(action.id,action).then(
          function (response) {
            if (type == "Aceptada")
              Notification.success('La acción ha pasado a acciones aceptadas');
            else if (type == "Terminada")
              Notification.success('La acción ha pasado a acciones terminadas');
            $scope.getClients($scope.clientStatus);
          },
          function (errors) {
            console.error(errors);
          }
        )
    }, function() {
    });
  }
  ///////////////////////////////////////End Action buttons methods/////////////////////////////////////////////
  $scope.onPromiseTypeSelect = function (type) {
    console.log(type);
    if(type == 'action'){
      $scope.getClients('Creada' );
      $scope.getProducers('Creada' );
    }else {
      $scope.getProjectsByProducer('Creada' );
      $scope.getProjectsByClient('Creada' );
    }
  }


  ///////////////////////////////////////stadistics/////////////////////////////////////////////
  $scope.getStadistics = function () {
    StadisticsService.get().then(function (response) {
      $scope.stadistics = response;
    },function (error) {
      console.error(error);
    })
  }
}]);


app.service('AuthService', function($http, $q,  APIConfig) {
  
  var url = APIConfig.url + 'token-auth/'

  this.login = function(data) {

      var deferred = $q.defer();

      $http.post(url, data).then(function(response) {
          deferred.resolve(response);
        }, function(errorResponse) {
          deferred.reject(errorResponse);
        });

      var promise = deferred.promise;
    
    return promise
  };

});


app.controller('LoginController', [
  '$scope','$state', '$http', '$window', 'AuthService', 'StorageService',
  function($scope, $state, $http, $window, AuthService, StorageService) {

    $scope.showAlert = false;

    $scope.loginSubmit = function(data) {

      AuthService.login(data)
        .then(function(response) {

          StorageService.set('token',response.data.token);
          $http.defaults.headers.common.Authorization = 'Token ' + StorageService.get('token');

          $state.go('coordinations');

        },function(errorResponse) {
          $scope.showAlert = true;

          if (errorResponse.data.non_field_errors) {
            $scope.error = "Nombre de usuario y/o contraseña inválidos.";
          }
          else {
            $scope.error = errorResponse.statusText || 'Request failed.';
          }

        });
    };

}]);


app.service("ProducerGetListService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getList = function(object) {
    var params = $.param(object);

    var promise = $http.get(APIConfig.url + "producers/?" + params).then(function(response) {

			for (var i=0; i < response.data.producers.length; i++) {
				response.data.producers[i].producer.photo = APIConfig.baseUrl + response.data.producers[i].producer.photo;
			}
      return response.data;
    });

    return promise;
  };
}]);


app.controller('ProfileController', ['$scope','ProducerGetListService','UserService','ProjectListService','APIConfig',
 function($scope, ProducerGetListService, UserService, ProjectListService, APIConfig) {

  $scope.producersCurrentPage = 1;
  $scope.clientsCurrentPage = 1;
  $scope.currentProjectPage = 1;

  $scope.client_id = [];
  $scope.producer_id = [];
  $scope.projects = {}
  $scope.listForm = {
    "phase": 'Preparación'
  }


  $scope.init = function(){
    UserService.me().then(
      function(response){
        $scope.user = response;
        $scope.performancePageChanged($scope.clientsCurrentPage, 'client_id');
        $scope.performancePageChanged($scope.producersCurrentPage, 'producer_id');
        $scope.projectPageChanged();
      }
    )
  }

  $scope.performancePageChanged = function(page, list) {
  	var query = {
  		"page": page,
  	};
    query[list] = $scope.user.id

  	ProducerGetListService.getList(query).then(
  		function(response) {
  			$scope[list] = response;
  		},
  		function(errorResponse) {
  			$scope.status = errorResponse.statusText || 'Request failed';
  			$scope.errors = errorResponse.data;
  		}
  	);
  };

  $scope.projectPageChanged = function() {

		var query = {
			"page": $scope.currentProjectPage,
			"phase": $scope.listForm.phase,
      "client":$scope.user.id
		};

		ProjectListService.getList(query).then(
			function(response) {
				$scope.projects = response
        console.log($scope.projects);
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

	};
  $scope.chunkArray = function(index) {
    if($scope.projects.results)
      return $scope.projects.results.slice(index*3, (index*3)+3);
  }

  $scope.getSize = function () {
    if($scope.projects.results){
      return new Array(Math.ceil($scope.projects.results.length/3));
    }
  }


  $scope.onProjectSelect = function (ite) {
    $scope.projectPageChanged();
  }
}]);


app.service('UserService', function($http, APIConfig,$q, StorageService) {

    this.search = function(name) {
        var results = undefined;
        var deferred = $q.defer();
        URL = APIConfig.url + 'users/';

        $http.get(URL+'?first_surname='+name)
          .then(function(result) {
            results = result.data;
            deferred.resolve(results);
          }, function(error) {
            results = error;
            deferred.reject(error);
          });

        results = deferred.promise;
      return $q.when(results);
    };


    this.me = function() {
        var results = undefined;
        var deferred = $q.defer();
        URL = APIConfig.url + 'myuser/';
        if(StorageService.get('user')){
          results = JSON.parse(StorageService.get('user'));

          deferred.resolve(results);
        }else{
          $http.get(URL)
            .then(function(result) {
              results = result.data;
              results.photo =  APIConfig.baseUrl+ results.photo
              StorageService.set('user',JSON.stringify(results))

              deferred.resolve(results);
            }, function(error) {
              results = error;
              deferred.reject(error);
            });
            results = deferred.promise;
        }
      return $q.when(results);
    };


    this.getList = function(params) {
        var results = undefined;
        var deferred = $q.defer();
        URL = APIConfig.url + 'users/';

        $http.get(URL+'?'+ params)
          .then(function(result) {
            results = result.data;
            angular.forEach(results.results, function(user){
              user.photo = APIConfig.baseUrl+ user.photo
            })
            deferred.resolve(results);
          }, function(error) {
            results = error;
            deferred.reject(error);
          });

        results = deferred.promise;
      return $q.when(results);
    };

    this.create = function(object) {
        URL = APIConfig.url + 'users/';

        var promise = $http.post(URL, object).then(function(response) {
            return response;
        });

        return promise;
    };

    this.update = function(object, id) {
        var URL = APIConfig.url + 'users/'+ id +"/";

        var promise = $http.put(URL, object).then(function(response) {
            return response;
        });

        return promise;
    };

    this.get = function (id) {
      var promise = $http.get(APIConfig.url + "users/" + id + "/").then(function(response) {
        return response.data;
      });
      return promise;

    }
});


app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectCreateService','UserService','Notification',
  function($scope, $state, ProjectCreateService, UserService, Notification) {
    $scope.submitted = false;

    $scope.project = {};

    UserService.me().then(function(response){

      $scope.project.client = response.id;
      $scope.client = response.name + " "+ response.first_surname + " " + response.second_surname;
    }, function(error){
      console.error("error",error);
    })

    var transformFields = [
        'preparation_at',
        'negotiation_at',
        'execution_at',
        'evaluation_at',

        'accomplish_at',
        'renegotiation_at',
        'report_at',
        'begin_at',
    ];

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        Notification.error('El formulario contiene errores');
        return;
      }

      var project = angular.copy($scope.project);

      angular.forEach(project, function(value, key) {
          transformFields.forEach(function(item) {

          if(key == item)
              project[key] = new moment(value).format("YYYY-MM-DD");
          })
      });

  		$scope.submmitPromise = ProjectCreateService.create(project).then(
  			function(response) {
  				Notification.success('El proyecto ha sido creado satisfactoriamente');
  				$state.go('coordinations');
  			},
  			function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
  	  	}
  		);

    }

}]);


app.service("ProjectCreateService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "projects/", object).then(function(response) {
      return response.data;
    });

    return promise;
  };


  this.update = function(id, object) {

    if(typeof(object.client) != Number)
        object.client = object.client.id;

    if(typeof(object.client) != Number)
        object.client = object.client.id;

    if(typeof(object.producer) != Number)
        object.producer = object.producer.id;

    if(object.observer && typeof(object.observer) != Number)
        object.observer = object.observer.id;

    delete(object.image)
      var promise = $http.patch(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
          return response.data;
      });

      return promise;
  };
}]);

app.service("UserListService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getList = function(object) {
    var params = $.param(object);

    var promise = $http.get(APIConfig.url + "users/?" + params).then(function(response) {
      return response.data;
    });

    return promise;
  };
}]);


app.controller('ProjectDetailController', [
	'$scope', '$state', 'ProjectGetService', 'ActionListService', 'APIConfig', 'ProducerGetListService', '$uibModal','$mdDialog',
	'ReportGetService','ProjectCreateService', 'UserService', 'Notification',
	function($scope, $state, ProjectGetService, ActionListService, APIConfig, ProducerGetListService, $uibModal,$mdDialog,
		 ReportGetService, ProjectCreateService,UserService, Notification) {

	$scope.actionCurrentPage = 1;
	$scope.producersCurrentPage = 1;
	$scope.producersPerformanceCurrentPage = 1;
	$scope.project = {};
	$scope.producers = [];
	$scope.producersPerformance = [];
	$scope.accomplishedStatus = 'Terminada'

	var queryStatus = "Creada";


  	$scope.getProjectByIdInit = function() {
			UserService.me().then(function(response){
				$scope.user = response
			}, function(error){
				console.error("error",error);
			})
			getProject();
			$scope.actionPageChanged()
			$scope.producerPageChanged($scope.producersCurrentPage,'producers' );
			$scope.producerPageChanged($scope.producersPerformanceCurrentPage,'producersPerformance' );
			$scope.getReport();

	}

	//Service call
	var getProject = function() {
		ProjectGetService.getById($state.params.id).then(
			function(response) {
				response.image = APIConfig.baseUrl + response.image;
				response.producer.photo = APIConfig.baseUrl + response.producer.photo;
				$scope.project = response;
				$scope.timeLineChanged();

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
	}

	$scope.getReport = function (){
    var query = {
      project_id: $state.params.id,
      action_id:'None'
    }
    ReportGetService.getList(query).then(
      function(response){
         $scope.report = response[response.length-1]
      }, function(errors){
        console.err(errors);
      });
  }

	$scope.actionPageChanged = function(status) {
			console.log("hola");
			queryStatus = status||queryStatus;
	  	var query = {
	  		"page": $scope.actionsCurrentPage,
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
	  		"status": queryStatus,
	  	};

			ActionListService.getList(query).then(
				function(response) {
					$scope.actions = response;
					console.log(response);

				},
				function(errorResponse) {
					$scope.status = errorResponse.statusText || 'Request failed';
					$scope.errors = errorResponse.data;
				}
			);
  };

	$scope.timeLineChanged = function() {
	  	var query = {
	  		"project_id": $state.params.id,
				'begin_date': moment($scope.project.begin_at).format('YYYY-MM-DD'),
	      'end_date': moment($scope.project.accomplish_at).format('YYYY-MM-DD'),
	  	};

		ActionListService.getList(query).then(
			function(response) {
				$scope.timelines = response;

			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  };


	$scope.producerPageChanged = function(page, list) {
	  	var query = {
	  		"page": page,
	  		"project_id": $state.params.id,
	  		"parent_action": "none",
	  	};

		ProducerGetListService.getList(query).then(
			function(response) {
				$scope[list] = response;
			},
			function(errorResponse) {
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
  };



	$scope.getColor = function(phase){
	 			if($scope.project.phase == phase){
	 				return 'bg-info '+$scope.project.color +'-status'
	 		}
	 	}

	////////////////////////////////// reports/////////////////////////

	$scope.openReportDetailModal = function() {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportDetailController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-detail/report-detail.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 report: $scope.report
		 }
		})
	}

	$scope.openfinishProjectReport = function(){
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-create/add-report.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 type:'project',
			 reportType:'finish',
		 }
	 }).then(function (obj) {
	 		if(obj.created == true){
				Notification.success("El proyecto ha pasado a estatus de terminado")
					$scope.project.status = 'Terminada'
			}

	 }).finally(function(response) {
      	$scope.getReport()
    });
	}

	$scope.openAdvanceReport = function() {

		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ReportModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/report-create/add-report.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 size: 'md',
		 locals:{
			 type:'project',
			 reportType:'advance',
		 }
		}).then(function (obj) {
 		 if(obj.created == true){
 			 Notification.success("Se ha reportado el avance")
 			 $scope.project.status = 'Reportada'
 		 }

 	 }).finally(function() {
      	$scope.getReport()
    });
	}
//////////////////////////////////end reports/////////////////////////

//////////////////////////////////modals//////////////////////////////
	$scope.openActionDetailModal = function(action) {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'ActionViewModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/project-detail/modals/action-detail-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 currentAction: action.id
		 }
		}).finally(function() {

    });
	}

	$scope.closeProjectReport = function(action) {
		$mdDialog.show({
		 scope:$scope,
		 preserveScope:true,
		 controller: 'CloseProjectModalController',
		 controllerAs: 'vm',
		 templateUrl: '/app/project-detail/modals/close-project-modal.html',
		 parent: angular.element(document.body),
		 clickOutsideToClose:true,
		 locals:{
			 project: $scope.project
		 }
		}).finally(function() {

    });
	}
//////////////////////////////////end modals//////////////////////////////


//////////////////////////////////template interaction functions//////////////////////////////////
	$scope.hoverIn = function(show){
		this.hoverEdit = show;
	};

	$scope.chunkArray = function(index) {
		if($scope.producers.producers)
			return $scope.producers.producers.slice(index*3, (index*3)+3);
	}
//////////////////////////////////end template interaction functions //////////////////////////////////

	var transformActions = function(results){
		//private functions
		function custom_sort(a, b) {
		    return new Date(a.timeline).getTime() - new Date(b.timeline).getTime();
		}

		function arrayObjectIndexOf(myArray, searchTerm, property) {
		    for(var i = 0, len = myArray.length; i < len; i++) {
		        if (myArray[i][property] === searchTerm) return i;
		    }
		    return -1;
		}

		function UniqueArraybyId(collection, keyname) {
              var output = [],
                  keys = [], d  =[];

              angular.forEach(collection, function(item) {
                  var key = item[keyname];
                  if(keys.indexOf(key) === -1) {
                      keys.push(key);
                      output.push(item);
                  }
									else{
										var pos = arrayObjectIndexOf(output,key,'timeline');
										output[pos].actions.push(item.actions[0])
									}
              });
							angular.forEach(d, function(item){
								var key = item[keyname];
							})
        return output;
		}


		var newArray = [];
		angular.forEach(results, function (result) {
			angular.forEach(dateFields, function(key, value){
				var obj = {}
				obj.timeline = result[value];
				obj.actions = [];
				result.timeline_text = key
				obj.actions.push(angular.copy(result))
				newArray.push(obj)

			})
		})

		newArray = newArray.sort(custom_sort);
		var newArray = UniqueArraybyId(newArray,'timeline');


		//asign photo
		newArray.forEach(function(item){
			angular.forEach(item.actions, function(item2){
				item2.producer.photo =  APIConfig.baseUrl+ angular.copy(item2.producer.photo);
			})
		})
		//end of asignment

		return newArray;
	}
}]);


app.service("ProjectGetService", ['$http', 'APIConfig', function($http, APIConfig) {

  var statusList = ['Terminada', 'Satisfactoria',  'Insatisfactoria']

  var getColor = function (project) {

      if(moment(project.accomplish_at).isBefore(moment())){
        angular.forEach(statusList, function(status){
          if (project.status == status)
            return 'green'
        })

        if(project.report == 0 )
          return 'red';
      }

      else if(moment(project.report_at).isBefore(moment()))
        return 'green';

      else if(moment(project.report_at).isBefore(moment()) && project.report == 0 )
        return 'yellow';

    return 'green'
  }


  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(
      function(response) {
        response.data.client.photo = APIConfig.baseUrl + response.data.client.photo;
        response.data.color = getColor(response.data);
      return response.data;
      }
    );

    return promise;
  }

}]);


app.controller('ProjectListController', [
	'$scope', 'ProjectListService', 'APIConfig','UserService',
	function($scope, ProjectListService, APIConfig, UserService) {

	$scope.currentPage = 1;
	$scope.listForm = {
		phase : 'Preparación',
		level : 'time'
	}

	$scope.init = function () {
		UserService.me().then(
			function(response){
				$scope.user = response;
				$scope.pageChanged();
				$scope.getProjectStadistics();
			}
		)
	}
	$scope.pageChanged = function() {

		var query = {
			"page": $scope.currentPage,
			"phase":$scope.listForm.phase,
			"client":$scope.user.id
		};

		ProjectListService.getList(query).then(
			function(response) {
				$scope.data = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);
	};

	$scope.getProjectStadistics = function () {
		ProjectListService.getProjectStadistics().then(
			function (response) {
				$scope.stadistics = response
			}, function (errors) {
				console.error(errors);
			}
		)
	}

	$scope.onProjectSelect = function () {
		$scope.pageChanged()
	}

}]);


app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {

	var statusList = ['Terminada', 'Satisfactoria',  'Insatisfactoria']

	var getColor = function (project) {

			if(moment(project.accomplish_at).isBefore(moment())){
				angular.forEach(statusList, function(status){
					if (project.status == status)
						return 'green'
				})

				if(project.report == 0 )
					return 'red';
			}

			else if(moment(project.report_at).isBefore(moment()))
				return 'green';

			else if(moment(project.report_at).isBefore(moment()) && project.report == 0 )
				return 'yellow';

		return 'green'
	}

	this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "projects/?" + params).then(function(response) {
		angular.forEach(response.data.results, function(project){
			project.image = APIConfig.baseUrl + project.image;
			project.producer.photo = APIConfig.baseUrl + project.producer.photo;
			project.client.photo = APIConfig.baseUrl + project.client.photo;
			project.color = getColor(project);
		})
		if(response.data.length){
			angular.forEach(response.data, function (project) {
				project.color = getColor(project);
			})
		}
	  return response.data;
	});
	  return promise;
	};

	this.getProjectStadistics = function() {
		var promise = $http.get(APIConfig.url + "projects/stadistics/time").then(function(response) {
			return response.data;
		});

		return promise;
	}

}]);


app.controller('ProjectUpdateController', [
  '$scope', '$state', 'ProjectGetService', 'ProjectUpdateService','APIConfig','Notification',
  function($scope, $state, ProjectGetService, ProjectUpdateService, APIConfig,Notification) {
    $scope.submitted = false;
    $scope.project = {};

    var transformFields = [
        'preparation_at',
        'negotiation_at',
        'execution_at',
        'evaluation_at',

        'accomplish_at',
        'renegotiation_at',
        'report_at',
        'begin_at',
    ];

    $scope.getProjectByIdInit = function() {
      ProjectGetService.getById($state.params.id).then(
        function(response) {
          console.log('getById', response);

          angular.forEach(response, function(value, key) {
              transformFields.forEach(function(item) {

              if(key == item) {
                var d = new Date(value);
                response[key] = new Date(d.getTime() + d.getTimezoneOffset() *60*1000);
              }

            })

          });
          response.image = APIConfig.baseUrl + response.image;
          $scope.project = response;
        },
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          var status = errorResponse.statusText || 'Request failed';
          var errors = errorResponse.data;
        }
      );
    }

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        Notification.error('El formulario contiene errores');
        return;
      }

      var project = angular.copy($scope.project);

      angular.forEach(project, function(value, key) {
          transformFields.forEach(function(item) {

          if(key == item)
              project[key] = new moment(value).format("YYYY-MM-DD");
          })

      });

  		$scope.submmitPromise = ProjectUpdateService.update($state.params.id, project).then(
  			function(response) {
          Notification.success('El proyecto ha sido actualizado');
  				$state.go('coordinations');
  			},
        function(errorResponse) {
          console.log('errorResponse', errorResponse);
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
  		);

    }

}]);


app.service("ProjectUpdateService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.update = function(id, object) {
    var promise = $http.put(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };

}]);


app.controller('ReportModalController', [ '$mdDialog','$state', 'ReportCreateService', 'UserService','type', 'reportType', '$scope','Notification',
 function($mdDialog, $state, ReportCreateService, UserService, type, reportType, $scope, Notification) {
   var $ctrl = this;
    $ctrl.reportTypeOptions = {
      "finish":{
        'name':'finish',
        'title':'Reporte de término '
      },
      "advance":{
        'name':'advance',
        'title':'Reporte de avance '
      }
    }
    $ctrl.reportTypeOptions = $ctrl.reportTypeOptions[reportType];

    $ctrl.submitted = false;
    $ctrl.report = {
      'progress':'25'
    }

    $ctrl.report[type] = $state.params.id;
    if(type == 'action'){
      $ctrl.report['project'] = $scope.currentAction.project.id;
    }

    $ctrl.sendReport = function(){
      $ctrl.submitted = true;

      if ($ctrl.reportForm.$invalid) {
        $ctrl.errors = 'El formulario no es válido.';
        return;
      }

      UserService.me().then(function(response){
        $ctrl.report.created_by = response.id

        $ctrl.submmitPromise = ReportCreateService.create($ctrl.report).then(
          function (response) {
            $mdDialog.hide({"created":true});

          },
          function (errorResponse) {
            console.error('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
          }
        );
      }, function(error){
        console.error("error",error);
      })
    }

    $ctrl.cancel = function () {
      $mdDialog.hide();
    };
}]);


app.service("ReportCreateService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.create = function(object) {
        var promise = $http.post(APIConfig.url + "reports/", object).then(function(response) {
            return response;
        });

        return promise;
    };

}]);


app.controller('ReportDetailController', ['$scope', '$mdDialog', 'report',function( $scope, $mdDialog, report) {
  console.log("detail" , report);
  var $ctrl = this;

  $ctrl.report = report;
  $ctrl.cancel = function () {
    $mdDialog.hide();
  };
}]);


app.service("ReportGetService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.getById = function(id) {
        var promise = $http.get(APIConfig.url + "reports/" + id + "/").then(function(response) {
            return response.data;
        });

        return promise;
    }

    this.getList = function(object) {
  		var params = $.param(object);
  	  var promise = $http.get(APIConfig.url + "reports/?" + params).then(function(response) {
  	  return response.data;
  	});
  	  return promise;
  	};


}]);


app.service("StadisticsService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.get = function(object = {}) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "actions/stadistics?" + params).then(function(response) {

	  return response.data;
	});
	  return promise;
	};
}]);


app.controller('UserCreateController', [ '$state', 'UserService', '$scope', 'Notification',
 function( $state, UserService, $scope, Notification) {
   $scope.user = {}

   console.log($state);
   if($state.params.id){
     UserService.get($state.params.id).then(
       function (response) {
         console.log(response);
         $scope.user = response;
       }
     )
   }

   $scope.submit = function (user) {
     if(!$scope.userForm.$valid){
       Notification.error("El formulario no es valido");
       return
     }
     else if($scope.user.password != $scope.passwordConfirmation){
       Notification.error("La contraseña no coincide con la confirmación");
     }

     if(!$state.params.id){
       $scope.submmitPromise = UserService.create(user).then(
         function (response) {
           $state.go("userList")
         },
         function(error){
           console.error(error);
         }
       )
     }else{
       console.log("update");
       $scope.submmitPromise = UserService.update(user, user.id).then(
         function (response) {
           $state.go("userList")
         },
         function(error){
           console.error(error);
         }
       )
     }

   }
}]);


app.controller('UserListController', [ '$state', 'UserService', '$scope',
 function( $state, UserService, $scope) {

   $scope.users = {}

///////////////////////////calling service functions ///////////////////////////

   UserService.getList({}).then(
     function (response) {
       $scope.users = response;
     }
   )

///////////////////////////end calling service functions ///////////////////////////

///////////////////////////template interaction functions ///////////////////////////
  $scope.getRowNumber = function() {
    if($scope.users.results){
      var num = Math.ceil($scope.users.results.length / 4)
      return new Array(num);
    }
  }

  $scope.chunkArray = function(index) {
    if($scope.users.results)
      return $scope.users.results.slice(index*4, (index*4)+4);
  }
  ///////////////////////////end  of template interaction functions ///////////////////////////

}]);

app.directive("panelLoader", ['$compile',function ($compile,$scope) {
    return {
       restrict: 'A',
        scope: {
            panelLoader: "="
        },
        link: function (scope, element, attributes) {
          var template ='<div  layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div>';

            scope.$watch('panelLoader', function (val) {
              if(typeof scope.panelLoader != 'undefined'){
                element.append($compile(template)(scope));

                  scope.panelLoader.then(function functionName() {
                      element = angular.element(element)
                      var child = element.children().length;
                      element.children()[child-1].remove();

                  }, function () {
                    console.log("fail");
                  })
              }
            })
        }
    }
}]);



app.directive('myHeader', ['URLTemplates','UserService',

  /** @ngInject */
  function myHeader(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/_components/header/header.html',
      scope: {
          creationDate: '='
      },
      controller: HeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController(APIConfig, $state, StorageService, UserService) {
      var vm = this;
      UserService.me().then(function(result){
        vm.user = result
      })

      if (!StorageService.get('token')) {
        $state.go('login');
      }

      vm.logout = function() {
        StorageService.remove('token');
        StorageService.remove('user');
        $state.go('login');
      }

    }
  }
]);



app.directive('myNavbar', ['URLTemplates',

  /** @ngInject */
  function myNavbar(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/_components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(APIConfig) {
      var vm = this;

      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

]);

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

app.directive("jqueryDate", ['$compile',function ($compile,$scope) {
    return {
        scope: {
            jqueryDate: "="
        },
        link: function (scope, element, attributes) {
            var date = moment(scope.jqueryDate);
            attributes.$set('data-date', date.format('DD/MM/YYYY'));
        }
    }
}]);



app.directive('timeLine', ['URLTemplates',

  /** @ngInject */
  function timeLine(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/_components/time-line/time-line.html',
      scope: {
          timeLine: '='
      },
      controller: TimeLineController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TimeLineController(APIConfig , $scope ) {
      var vm = this;

      var dateFields = {
          'accomplish_at':'Fecha de cumplimiento',
          'report_at':'Fecha de reporte',
          'begin_at':'Fecha de inicio',
        };

    	var transformActions = function(results){
    		//private functions

    		function custom_sort(a, b) {
    		    return new Date(a.timeline).getTime() - new Date(b.timeline).getTime();
    		}

    		function arrayObjectIndexOf(myArray, searchTerm, property) {
    		    for(var i = 0, len = myArray.length; i < len; i++) {
    		        if (myArray[i][property] === searchTerm) return i;
    		    }
    		    return -1;
    		}

    		function UniqueArraybyId(collection, keyname) {
                  var output = [],
                      keys = [], d  =[];

                  angular.forEach(collection, function(item) {
                      var key = item[keyname];
                      if(keys.indexOf(key) === -1) {
                          keys.push(key);
                          output.push(item);
                      }
    									else{
    										var pos = arrayObjectIndexOf(output,key,'timeline');
    										output[pos].actions.push(item.actions[0])
    									}
                  });
    							angular.forEach(d, function(item){
    								var key = item[keyname];
    							})
            return output;
    		}


    		var newArray = [];
    		angular.forEach(results, function (result) {
    			angular.forEach(dateFields, function(key, value){
    				var obj = {}
    				obj.timeline = result[value];
    				obj.actions = [];
    				result.timeline_text = key
    				obj.actions.push(angular.copy(result))
    				newArray.push(obj)

    			})
    		})

    		newArray = newArray.sort(custom_sort);
    		var newArray = UniqueArraybyId(newArray,'timeline');


    		//asign photo
    		newArray.forEach(function(item){
    			angular.forEach(item.actions, function(item2){
    				item2.producer.photo =  APIConfig.baseUrl+ angular.copy(item2.producer.photo);
    			})
    		})
    		//end of asignment

    		return newArray;
    	}

      var time = $scope.$watch( 'vm.timeLine', function () {
        if(vm.timeLine ){
          console.log("una", vm.timeLine);
            vm.timeLine = transformActions(vm.timeLine)
            $.getScript("/assets/metronics/global/plugins/horizontal-timeline/horizontal-timeline.js", function(){});
            
            time();
        }

      });

    }
  }

]);



app.directive('userSearch', ['URLTemplates', 'UserListService', '$timeout',

  /** @ngInject */
  function userSearch(URLTemplates, UserListService, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/_components/user-search/search.html',
      scope: {
          fieldName: '@',
          userId: '=',
          userInit: '=',
      },
      controller: SearchUserController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function SearchUserController() {
      var vm = this;

      $timeout( function(){
        vm.selectedItem = vm.userInit;
      }, 2000 );
      // ******************************
      // Internal methods
      // ******************************

      vm.querySearch = function(searchText) {

        var query = {
          'first_surname':vm.searchText
        }

        UserListService.getList(query).then(
          function(response) {
            vm.results = response.results;
          },
          function(errorResponse) {
            vm.error = errorResponse.statusText || 'Request failed.';
            console.log('response', errorResponse);
          }
        );

      };

      vm.selectedItemChange = function(item) {
        if(item)
          vm.userId = item.id;
      };

    }

  }

]);


app.controller('CloseActionModalController', ['$scope','$mdDialog','action','Notification', 'ActionCreateService',
  function($scope,$mdDialog, action, Notification, ActionCreateService) {

    var $ctrl = this;
    $ctrl.action = action;
    $ctrl.submitted = false;

    $ctrl.closeProject = function(status){
      $ctrl.submitted = true;
      var action = angular.copy($ctrl.action);
      action.status = status
      if (!status) {
        Notification.success('El formulario no es válido.');
        return;
      }
        $scope.submmitPromise = ActionCreateService.update(action.id, action).then(
          function (response) {
            $mdDialog.hide();
            Notification.success("El proyecto ha pasado a estatus de cerrado")

          },
          function (errorResponse) {
            console.error('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
          }
        );

    }

    $ctrl.cancel = function () {
      $mdDialog.hide();
    };
}]);


app.controller('ActionViewModalController', ['$scope','$mdDialog','currentAction','ActionListService','ActionGetService',
  function($scope,$mdDialog, currentAction, ActionListService, ActionGetService) {

    var $ctrl = this;
    $ctrl.action = currentAction;
    $ctrl.actionCurrentPage = 1
    var actionStatus = "Creada"
    $ctrl.accomplishedStatus = 'Terminada'


    $ctrl.init = function () {
      $ctrl.getAction();
      $ctrl.actionPageChanged()
    }
    $ctrl.actionPageChanged = function(status) {
  		actionStatus = status||actionStatus;

       	var query = {
  			"parent_action_id": currentAction,
  			"page": $ctrl.actionCurrentPage,
  			"status": actionStatus,
  		};

  		ActionListService.getList(query).then(
  			function(response) {
  				$ctrl.actions = response;
  				console.log("actions", response);
  			},
  			function(errorResponse) {
  				$ctrl.status = errorResponse.statusText || 'Request failed';
  				$ctrl.errors = errorResponse.data;
  			}
  		);

    };

    $ctrl.getAction = function () {
      ActionGetService.getById($ctrl.action).then(
        function(response) {
          $ctrl.action = response;
        },
        function(errorResponse) {
            console.log('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
        }
      );
    }

    $ctrl.getColor = function(phase){
        if($ctrl.action.phase == phase){
          return $ctrl.action.color+ "-status"
      }
    }
}]);


app.controller('CloseProjectModalController', ['$scope','$mdDialog','project','Notification', 'ProjectCreateService',
  function($scope,$mdDialog, project, Notification, ProjectCreateService) {

    var $ctrl = this;
    $ctrl.project = project;
    $ctrl.submitted = false;

    $ctrl.closeProject = function(status){
      $ctrl.submitted = true;
      var project = angular.copy($ctrl.project);
      project.status = status
      if (!status) {
        Notification.success('El formulario no es válido.');
        return;
      }
        $scope.submmitPromise = ProjectCreateService.update(project.id, project).then(
          function (response) {
            $mdDialog.hide();
            Notification.success("El proyecto ha pasado a estatus de cerrado")

          },
          function (errorResponse) {
            console.error('errorResponse', errorResponse);
            $ctrl.status = errorResponse.statusText || 'Request failed';
            $ctrl.errors = errorResponse.data;
          }
        );

    }

    $ctrl.cancel = function () {
      $mdDialog.hide();
    };
}]);
