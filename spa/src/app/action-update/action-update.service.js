
app.service("ActionUpdateService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.update = function(id, object) {
    var promise = $http.put(APIConfig.url + "actions/" + id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };

}]);
