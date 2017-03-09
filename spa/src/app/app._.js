
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