

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