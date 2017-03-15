
app.service('AuthService', function($http, APIConfig) {
  URL = APIConfig.url + 'token-auth/'
  this.login = function(data) {
    console.log(data);
    $http.post(URL, data) .then(
      function(results){
        console.log("results", results);
      },
      function(error){
        console.log(error);
      }
    );
  }
});
