
"use strict";

var app = angular.module('myApp',
  [
		'ui.router',
		'ngMaterial',
    'ngDialog',
    'ui.bootstrap',
    'ui.calendar',
    'angularPromiseButtons',
    'ui-notification',
    'ngTimeline'

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

app.config(function (angularPromiseButtonsProvider, $httpProvider)
{
  angularPromiseButtonsProvider.extendConfig({
     spinnerTpl: '<i  style="display: none;" class=" btn-spinner fa fa-circle-o-notch fa-spin"></i>',
  });

  $httpProvider.interceptors.push('authHttpResponseInterceptor');
})
