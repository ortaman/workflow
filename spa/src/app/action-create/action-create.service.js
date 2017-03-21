
app.service("ActionCreateService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "actions/", object).then(function(response) {
      return response.data;
    });

    return promise;
  };
}]);
