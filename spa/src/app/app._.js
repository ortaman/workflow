
"use strict";

var app = angular.module('myApp',
  [
		'ui.router',
		'ngMaterial',
    'ngDialog',
    'ui.bootstrap',
    'ui.calendar'

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
