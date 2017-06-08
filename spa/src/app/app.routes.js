

app.config(function($stateProvider, $urlRouterProvider,
  $mdThemingProvider, $mdDateLocaleProvider) {

  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "app/login/login.html",
      controller: "LoginController"
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "app/profile/profile.html",
      controller: "ProfileController"
    })
    .state('coordinations', {
      url: "/coordinations",
      templateUrl: "app/coordinations/coordinations.html",
      controller: "CoordinationsController"
    })


    .state('projectCreate', {
      url: "/projectCreate",
      templateUrl: "app/project-create/project-create.html",
      controller: "ProjectCreateController"
    })
    .state('projectList', {
      url: "/projectList",
      templateUrl: "app/project-list/project-list.html",
      controller: "ProjectListController"
    })
    .state('projectDetail', {
      url: "/projectDetail/:id/",
      templateUrl: "app/project-detail/project-detail.html",
      controller: "ProjectDetailController"
    })
    .state('projectUpdate', {
      url: "/projectUpdate/:id/",
      templateUrl: "app/project-update/project-update.html",
      controller: "ProjectUpdateController"

    })

    .state('actionCreate', {
      url: "/actionCreate/:projectId/:actionId/",
      templateUrl: "app/action-create/action-create.html",
      controller: "ActionCreateController"
    })
    .state('actionDetail', {
      url: "/actionDetail/:id/",
      templateUrl: "app/action-detail/action-detail.html",
      controller: "ActionDetailController"
    })
    .state('actionUpdate', {
      url: "/actionUpdate/:id/",
      templateUrl: "app/action-update/action-update.html",
      controller: "ActionUpdateController"
    })
    .state('actionList', {
      url: "/actionList",
      templateUrl: "app/action-list/action-list.html",
      controller: "ActionListController",
    })
    .state('actionView', {
      url: "/actionView/:id",
      templateUrl: "app/action-detail/action-view.html",
      controller: "ActionViewController",
    })
    .state('projectView', {
      url: "/projectView/:id",
      templateUrl: "app/project-detail/project-view.html",
      controller: "ProjectViewController",
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
