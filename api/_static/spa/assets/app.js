
"use strict";

var app = angular.module('myApp', 
  [
		'ui.router',
		'ngDialog',
		'ngMaterial',

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



app.config(function($stateProvider, $urlRouterProvider, URLTemplates) {

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
    .state('projectDetail', {
      url: "/projectDetail",
      templateUrl: URLTemplates + "app/project-detail/project-detail.html",
      controller: "ProjectDetailController" 
    })
    .state('projectList', {
      url: "/projectList",
      templateUrl: URLTemplates + "app/project-list/project-list.html",
      controller: "ProjectListController" 
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

});


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

app.controller('ActionCreateController', ['$scope', function($scope) {
  
  console.log('ActionCreateController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


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

app.controller('ProjectCreateController', ['$scope', function($scope) {
  
  console.log('ProjectCreateController');
 
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


app.controller('CoordinationsController', ['$scope', function($scope) {
  
  console.log('CoordinationsController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('ProfileController', ['$scope', function($scope) {
  
  console.log('ProfileController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('ProjectListController', ['$scope', function($scope) {
  
  console.log('ProjectListController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('ProjectDetailController', ['$scope', function($scope) {
  
  console.log('ProjectDetailController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

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