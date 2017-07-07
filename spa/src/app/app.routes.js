

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
      url: "/profile/:id",
      templateUrl: "app/profile/profile.html",
      controller: "ProfileController"
    })
    .state('coordinations', {
      url: "/coordinations",
      templateUrl: "app/coordinations/coordinations.html",
      controller: "CoordinationsController"
    })
    .state('projectCreate', {
      url: "/projectCreate/:parentProject",
      templateUrl: "app/project-create/project-create.html",
      controller: "ProjectCreateController"
    })
    .state('actionCopy', {
      url: "/actionCopy/:action",
      templateUrl: "app/action-copy/action-copy.html",
      controller: "ActionCopyController"
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
    .state('projectView', {
      url: "/projectView/:id/",
      templateUrl: "app/project-view/project-view.html",
      controller: "ProjectViewController"
    })
    .state('projectUpdate', {
      url: "/projectUpdate/:id/",
      templateUrl: "app/project-update/project-update.html",
      controller: "ProjectUpdateController"

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
    .state('alerts', {
      url: "/alerts",
      templateUrl: "app/alerts/alerts.html",
      controller: "AlertsController",
    })
    .state('notifications', {
      url: "/notifications",
      templateUrl: "app/notifications/notifications.html",
      controller: "NotificationsController",
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
