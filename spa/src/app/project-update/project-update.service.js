
app.service("ProjectUpdateService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(function(response) {
      return response.data;
    });

    return promise;
  }  

  this.update = function(id, object) {
    var promise = $http.put(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };
}]);
