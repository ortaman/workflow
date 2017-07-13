
app.service("NotificationsService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "actions/notifications/?" + params).then(function(response) {

	     return response.data;
	  });
	  return promise;
	};


  this.update = function(object) {

    var promise = $http.put(APIConfig.url + "actions/notifications/" + object.id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };


}]);
