
"use strict";

var app = angular.module('myApp',
  [
		'ui.router',
		'ngMaterial',
    'ngDialog',
    'ui.bootstrap',
    
    // 'myApp.actionList',
  ]
);

app.run(function($http, $rootScope, $location, StorageService) {

  $http.defaults.headers.common['Accept'] = 'application/json';
  $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';

  if (StorageService.get('token')) {
    $http.defaults.headers.common.Authorization = 'Token ' + StorageService.get('token');
  }

  // initialise google analytics
  // $window.ga('create', 'UA-81230345-1', 'auto');

  // track pageview on state change
  // $rootScope.$on('$stateChangeSuccess', function (event) {
    // $window.ga('send', 'pageview', $location.path());
  // });

});

if(window.location.hash === '#_=_') window.location.hash = '#!';


app.constant('APIConfig', {
  url: 'http://localhost:9000/api/',
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
      url: "/projectDetail",
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
      url: "/actionCreate",
      templateUrl: URLTemplates + "app/action-create/action-create.html",
      controller: "ActionCreateController" 
    })
    .state('actionList', {
      url: "/actionList",
      templateUrl: "app/action-list/action-list.html",
      controller: "ActionListController",
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

app.controller('ActionCreateController', ['$scope', 'ProjectListService', 'ActionCreateService', '$state',
    function($scope, ProjectListService, ActionCreateService, $state) {

  $scope.projectList =[];
  $scope.submitted = false;

  $scope.getProjectList = function(){
    var query = {"page": "1"};
    ProjectListService.getList(query).then(
      function(data) {
        $scope.projectList = data.results;
      },
      function(error) {
      }
    );
  }

  $scope.submit = function (_action) {
    $scope.submitted = true;
    var action = angular.copy(_action);
    action.accomplish_at = moment(action.accomplish_at).format("DD-MM-YYYY");
    action.expire_at = moment(action.expire_at).format("DD-MM-YYYY");
    action.renegotiation_at = moment(action.renegotiation_at).format("DD-MM-YYYY");
    action.report_at = moment(action.report_at).format("DD-MM-YYYY");
    action.begin_at = moment(action.begin_at).format("DD-MM-YYYY");

    ActionCreateService.create(action).then(
      function (data) {
        console.log("data", data);
        $state.go('actionList')

      },
      function (data) {
        console.log("error", data.error);
      }
    );
  }

}]);


app.service("ActionCreateService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "actions/", object).then(function(response) {
      return response;
    });

    return promise;
  };
}]);



app.controller('ActionListController', ['$scope', 'ActionService', function($scope, ActionService) {
  
  console.log('ActionListController');

	ActionService.getList().then(
		function(response) {
			console.log('reponse', response);
		},
		function(errorResponse) {
			  error = errorResponse || 'Request failed';
    		console.log('error', error);
  		}
	);
 
  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


/*
angular.module('myApp.actionList', ['ui.router']);

angular.module('myApp.actionList').config('$http', 'APIConfig', function($http, APIConfig) {

  // Now set up the states
  $stateProvider
    .state('actionList', {
      url: "/actionList",
      templateUrl: "app/action-list/action-list.html",
      controller: "ActionListController",
    })
});

app.module('myApp.actionList').service("ActionService", ['$http', function($http) {
	this.getList = function() {
	  var promise = $http.get(APIConfig.url + "api/actions/").then(function(response) {
	  return response.data;
	});
	  return promise;
	};
}]);

app.module('myApp.actionList').controller('ActionListController', ['URLTemplates','$scope', 'ActionService', function(URLTemplates,$scope, ActionService) {
  
  console.log('ActionListController');

	ActionService.getList().then(
		function(response) {
			console.log('reponse', response);
		},
		function(errorResponse) {
			  error = errorResponse || 'Request failed';
    		console.log('error', error);
  		}
	);
 
  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);
*/

app.service("ActionService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.getList = function() {
	  var promise = $http.get(APIConfig.url + "actions/").then(function(response) {
	  	console.log(APIConfig.url + "actions/");
	  return response.data;
	});
	  return promise;
	};
}]);

/*
app.service("ActionService", function($http, APIConfig) {
	this.save = function(action) {
	  $http.post(APIConfig.url + "api/actions/", action).then(
	    function(response) {
	      return response.data;
	    },
 	    function(errorResponse) {
        return response.data || 'Request failed';
      }
    );
	};
	this.getList = function() {
	    var promise = $http.get(APIConfig.url + "api/actions/").then(function(response) {
	    return response.data;
	  });
	    return promise;
	};
	this.getById = function() {
	    var promise = $http.get(APIConfig.url + "/api/action/").then(function(response) {
	    return response.data;
	  });
	};
	this.update = function(action, id) {
	    var promise = $http.put(APIConfig.url + "/api/action/" + id + "/", action).then(function(response) {
	    return response.data;
	  });
	};
});
*/

app.controller('CoordinationsController', ['$scope', function($scope) {
  
  console.log('CoordinationsController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
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


app.controller('ProfileController', ['$scope', function($scope) {
  
  console.log('ProfileController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.service('UserService', function($http, APIConfig,$q) {

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

});


app.controller('ProjectCreateController', [
  '$scope', '$state', 'ProjectCreateService',
  function($scope, $state, ProjectCreateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        $scope.error = 'El formulario no es válido o no ha sido modificado.';
        console.log($scope.projectForm);
        return;
      }

      $scope.project.preparation_at = moment($scope.project.preparation_at1).format("DD-MM-YYYY");
    	$scope.project.negotiation_at = moment($scope.project.negotiation_at1).format("DD-MM-YYYY");
    	$scope.project.execution_at = moment($scope.project.execution_at1).format("DD-MM-YYYY");
    	$scope.project.evaluation_at = moment($scope.project.evaluation_at1).format("DD-MM-YYYY");
    	$scope.project.begin_at = moment($scope.project.begin_at1).format("DD-MM-YYYY");
    	$scope.project.accomplish_at = moment($scope.project.accomplish_at1).format("DD-MM-YYYY");
    	$scope.project.renegotiation_at = moment($scope.project.renegotiation_at1).format("DD-MM-YYYY");
    	$scope.project.report_at = moment($scope.project.report_at1).format("DD-MM-YYYY");

  		ProjectCreateService.create($scope.project).then(
  			function(response) {
  				console.log('reponse', response);
  				$state.go('projectList');
  			},
  			function(errorResponse) {
  				var error = errorResponse || 'Request failed';
  	    		console.log('error', error);
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


app.controller('ProjectDetailController', ['$scope', function($scope) {
  
  console.log('ProjectDetailController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('ProjectListController', [
	'$scope', 'ProjectListService',
	function($scope, ProjectListService) {

	$scope.currentPage = 1;

  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

  $scope.pageChanged = function() {

	  var query = {"page": $scope.currentPage};

		ProjectListService.getList(query).then(
			function(response) {
				$scope.data = response
				console.log('$scope.data', $scope.data);
			},
			function(errorResponse) {
				error = errorResponse || 'Request failed';
				console.log('errorResponse', error);
			}
		);

  };

  $scope.pageChanged()

}]);


app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "projects/?" + params).then(function(response) {
	  return response.data;
	});
	  return promise;
	};
}]);


app.controller('ProjectUpdateController', [
  '$scope', '$state', 'ProjectUpdateService',
  function($scope, $state, ProjectUpdateService) {
    $scope.submitted = false;
    $scope.project = {};

    $scope.getProjectByIdInit = function() {
      ProjectUpdateService.getById($state.params.id).then(
        function(response) {
          console.log('getById', response);
          $scope.project = response;

          $scope.project.preparation_at1 = new Date($scope.project.preparation_at);
          $scope.project.negotiation_at1 = new Date($scope.project.negotiation_at);
          $scope.project.execution_at1 = new Date($scope.project.execution_at);
          $scope.project.evaluation_at1 = new Date($scope.project.evaluation_at);
          $scope.project.begin_at1 = new Date($scope.project.begin_at);
          $scope.project.accomplish_at1 = new Date($scope.project.accomplish_at);
          $scope.project.renegotiation_at1 = new Date($scope.project.renegotiation_at);
          $scope.project.report_at1 = new Date($scope.project.report_at);

        },
        function(errorResponse) {
          var error = errorResponse || 'Request failed';
            console.log('error', error);
          }
      );
    }

    $scope.submitForm = function() {
      $scope.submitted = true;

      if ($scope.projectForm.$invalid) {
        $scope.error = 'El formulario no es válido o no ha sido modificado.';
        console.log($scope.projectForm);
        return;
      }

      $scope.project.preparation_at = moment($scope.project.preparation_at1).format("DD-MM-YYYY");
    	$scope.project.negotiation_at = moment($scope.project.negotiation_at1).format("DD-MM-YYYY");
    	$scope.project.execution_at = moment($scope.project.execution_at1).format("DD-MM-YYYY");
    	$scope.project.evaluation_at = moment($scope.project.evaluation_at1).format("DD-MM-YYYY");
    	$scope.project.begin_at = moment($scope.project.begin_at1).format("DD-MM-YYYY");
    	$scope.project.accomplish_at = moment($scope.project.accomplish_at1).format("DD-MM-YYYY");
    	$scope.project.renegotiation_at = moment($scope.project.renegotiation_at1).format("DD-MM-YYYY");
    	$scope.project.report_at = moment($scope.project.report_at1).format("DD-MM-YYYY");

  		ProjectUpdateService.update($state.params.id, $scope.project).then(
  			function(response) {
  				console.log('reponse', response);
  				$state.go('projectList');
  			},
  			function(errorResponse) {
  				var error = errorResponse || 'Request failed';
  	    		console.log('error', error);
  	  		}
  		);
    
    }

}]);


app.service("ProjectUpdateService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(function(response) {
      return response.data;
    });

    return promise;
  }  

  this.update = function(id, object) {
    var promise = $http.put(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };
}]);



app.directive('myHeader', ['URLTemplates',

  /** @ngInject */
  function myHeader(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/components/header/header.html',
      scope: {
          creationDate: '='
      },
      controller: HeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController(APIConfig, $state, StorageService) {
      var vm = this;

      if (!StorageService.get('token')) {
        $state.go('login');
      }

      vm.logout = function() {
        StorageService.remove('token');
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
      templateUrl: URLTemplates + 'app/components/navbar/navbar.html',
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


app.directive('userSearch', ['URLTemplates', 'UserListService', '$timeout',

  /** @ngInject */
  function userSearch(URLTemplates, UserListService, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/components/user-search/search.html',
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
