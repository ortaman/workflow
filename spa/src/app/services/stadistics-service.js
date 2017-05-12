
app.service("StadisticsService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.get = function(object = {}) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "actions/stadistics?" + params).then(function(response) {

	  return response.data;
	});
	  return promise;
	};
}]);
