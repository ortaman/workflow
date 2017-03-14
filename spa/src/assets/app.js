
var app = angular.module('myApp', 
  [
		'ui.router',
		'ngDialog',
		'ngMaterial'
  ]
);

app.run(function($rootScope, $location, $window) {
  
  // initialise google analytics
  // $window.ga('create', 'UA-81230345-1', 'auto');

  // track pageview on state change
  // $rootScope.$on('$stateChangeSuccess', function (event) {
    // $window.ga('send', 'pageview', $location.path());
  // });
  
});

app.constant('APIConfig', {
  url: 'http://127.0.0.1:9000/api/',
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
    .state('coordinations', {
      url: "/coordinations",
      templateUrl: URLTemplates + "app/coordinations/coordinations.html",
      controller: "CoordinationsController"
    })
    .state('projectList', {
      url: "/projectList",
      templateUrl: URLTemplates + "app/project_list/project_list.html",
      controller: "ProjectListController" 
    })
    .state('actionList', {
      url: "/actionList",
      templateUrl: URLTemplates + "app/action_list/action_list.html",
      controller: "ActionListController" 
    })
    .state('projectCreate', {
      url: "/projectCreate",
      templateUrl: URLTemplates + "app/project_create/project_create.html",
      controller: "ProjectCreateController" 
    })
    .state('actionCreate', {
      url: "/actionCreate",
      templateUrl: URLTemplates + "app/action_create/action_create.html",
      controller: "ActionCreateController" 
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


app.controller('ActionListController', ['$scope', function($scope) {
  
   console.log('ActionListController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


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


app.controller('ProjectListController', ['$scope', function($scope) {
  
  console.log('ProjectListController');
 
   $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('LoginController', ['$scope', function($scope) {
   
  console.log('LoginController');

  $scope.isActive = function(path) {
    return ($location.path()==path)
  }

}]);


app.controller('ProjectCreateController', ['$scope', function($scope) {
  
  console.log('ProjectCreateController');
 
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