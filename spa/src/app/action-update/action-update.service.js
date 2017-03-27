
app.service("ActionUpdateService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.update = function(id, object) {

    if(typeof(object.project) != Number)
      object.project = object.project.id;
    var transformFields = ['accomplish_at', 'expire_at', 'renegotiation_at', 'report_at', 'begin_at'];
    angular.forEach(object, function(value, key) {
      transformFields.forEach(function(item){
          if(key == item)
            object[key] = new moment(object).format("DD-MM-YYYY");
      })
    });

    var promise = $http.put(APIConfig.url + "actions/" + id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };

}]);
