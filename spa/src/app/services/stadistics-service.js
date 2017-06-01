
app.service("StadisticsService", ['$http', 'APIConfig', function($http, APIConfig) {

	this.get = function(object = {}) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/stadistics?" + params).then(function(response) {
	  return response.data;
	});
	  return promise;
	};

	var getPhoto = function () {

	}

	this.todo = function(object = {}) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/stadistics/todo" + params).then(
			function(response) {

	  		return response.data;
			}
		);
	  return promise;
	};

	this.oweme = function(object = {}) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/stadistics/oweme" + params).then(
			function(response) {
				console.log(response.data);
	  		return response.data;
			}
		);
	  return promise;
	};

}]);
