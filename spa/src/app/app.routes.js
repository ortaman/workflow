

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