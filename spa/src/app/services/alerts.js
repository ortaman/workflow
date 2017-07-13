app.service("AlertsService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "actions/alerts/?" + params).then(function(response) {

	     return response.data;
	  });
	  return promise;
	};


  this.update = function(object) {

    var promise = $http.put(APIConfig.url + "actions/alerts/" + object.id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };

}]);
