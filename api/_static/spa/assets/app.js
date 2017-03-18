
var app = angular.module('myApp', 
  [
		'ui.router',
		'ngDialog',
		'ngMaterial',

    // 'myApp.actionList',
  ]
);

app.run(function($http, $rootScope, $location, $window) {

  $http.defaults.headers.common['Accept'] = 'application/json';
  $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
  $http.defaults.headers.common.Authorization = 'Token 369643b407efd4c058b89af95cc97464444c8876';

  // initialise google analytics
  // $window.ga('create', 'UA-81230345-1', 'auto');

  // track pageview on state change
  // $rootScope.$on('$stateChangeSuccess', function (event) {
    // $window.ga('send', 'pageview', $location.path());
  // });
  
});

if(window.location.hash === '#_=_') window.location.hash = '#!';


app.constant('APIConfig', {
  url: 'http://localhost:9000/',
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

app.controller('ActionCreateController', ['$scope', function($scope) {
  
  console.log('ActionCreateController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

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
	  var promise = $http.get(APIConfig.url + "api/actions/").then(function(response) {
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


app.controller('HomeController', ['$scope', function($scope) {
  
  console.log('HomeController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('LoginController', ['$scope','$state', '$http', 'AuthService', '$window', function($scope, $state, $http, AuthService, $window) {

  $scope.showAlert = false;
  $scope.errors

  $scope.loginSubmit = function(data){
    $scope.getPosts = function() {
    AuthService.login(data)
      .then(function(data) {
        $window.localStorage.setItem("token",data.token);
        $state.go('coordinations')
      },function(error){
        $scope.errors = error.data;
        $scope.showAlert = true;
      });
    };
    $scope.getPosts();

  }
}]);


app.service('AuthService', function($http, APIConfig,$q) {
  URL = APIConfig.url + 'token-auth/'

    var posts = undefined;
    this.login = function(data) {


        var deferred = $q.defer();

        $http.post(URL,data)
          .then(function(result) {
            posts = result.data;
            deferred.resolve(posts);
          }, function(error) {
            posts = error;
            deferred.reject(error);
          });

        posts = deferred.promise;
      
      return $q.when(posts);
    };

});


app.controller('ProfileController', ['$scope', function($scope) {
  
  console.log('ProfileController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.service('UserService', function($http, APIConfig,$q) {
  URL = APIConfig.url + 'api/users/';

    var posts = undefined;
    this.search = function(data) {
        var deferred = $q.defer();

        $http.post(URL,data)
          .then(function(result) {
            posts = result.data;
            deferred.resolve(posts);
          }, function(error) {
            posts = error;
            deferred.reject(error);
          });

        posts = deferred.promise;
      return $q.when(posts);
    };

});


app.controller('ProjectCreateController', ['$scope', 'ProjectService', function($scope, ProjectService) {

  var submited = false;

  $scope.submit = function(data) {
    console.log("datos enviar",data);
    submited = true;
    ProjectService.create(data).then(
      function(result){
        console.log(result);
      },
      function(result){
        console.log(result);
      }
    )
  }

}]);


app.service('ProjectService', function($http, APIConfig,$q) {
  URL = APIConfig.url + 'api/projects/';

    var posts = undefined;
    this.create = function(data) {
        var deferred = $q.defer();

        $http.post(URL,data)
          .then(function(result) {
            posts = result.data;
            deferred.resolve(posts);
          }, function(error) {
            posts = error;
            deferred.reject(error);
          });

        posts = deferred.promise;
      return $q.when(posts);
    };

});


app.controller('ProjectDetailController', ['$scope', function($scope) {
  
  console.log('ProjectDetailController');
 
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
    function HeaderController(APIConfig) {
      var vm = this;

      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
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


app.directive('peopleSearch', ['URLTemplates',

  function peopleSearch(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/components/people-search/search.html',
      scope: {
          userId: '=userId',
      },
      link: SearchController,
    };

    return directive;

    function SearchController(scope, element, attrs) {

      scope.selectedItemChange = function(user) {
        scope.userId = user.id;
      }

      scope.query = function (query) {
        return [
            {
              "id": 6,
              "username": "user3",
              "email": "user3@user.com",
              "name": "nombre",
              "first_surname": "apellido I",
              "second_surname": "apellido II"
          },
        ]
      }
    }
  }

]);
