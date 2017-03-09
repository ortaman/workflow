

app.config(function($stateProvider, $urlRouterProvider, URLTemplates) {

  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: URLTemplates + "app/home/home.html",
      controller: "HomeController"
    })
    .state('login', {
      url: "/login",
      templateUrl: URLTemplates + "app/login/login.html",
      controller: "LoginController" 
    })

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/home");

});