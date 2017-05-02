
app.service("ProjectCreateService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "projects/", object).then(function(response) {
      return response.data;
    });

    return promise;
  };


  this.update = function(id, object) {

    if(typeof(object.client) != Number)
        object.client = object.client.id;

    if(typeof(object.client) != Number)
        object.client = object.client.id;

    if(typeof(object.producer) != Number)
        object.producer = object.producer.id;

    if(typeof(object.observer) != Number)
        object.observer = object.observer.id;

    delete(object.image)
      var promise = $http.patch(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
          return response.data;
      });

      return promise;
  };
}]);

app.service("UserListService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getList = function(object) {
    var params = $.param(object);

    var promise = $http.get(APIConfig.url + "users/?" + params).then(function(response) {
      return response.data;
    });

    return promise;
  };
}]);
