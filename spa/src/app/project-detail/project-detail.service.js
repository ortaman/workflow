
app.service("ProjectGetService", ['$http', 'APIConfig', function($http, APIConfig) {
  
  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(function(response) {
      return response.data;
    });

    return promise;
  }  

}]);
