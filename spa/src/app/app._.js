
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
