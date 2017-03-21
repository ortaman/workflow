
app.service("ActionGetService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "actions/" + id + "/").then(function(response) {
      return response.data;
    });

    return promise;
  }

}]);
