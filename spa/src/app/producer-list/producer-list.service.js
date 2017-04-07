
app.service("ProducerGetListService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getList = function(object) {
    var params = $.param(object);
    
    var promise = $http.get(APIConfig.url + "producers/?" + params).then(function(response) {
      return response.data;
    });

    return promise;
  };
}]);