
app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "projects/?" + params).then(function(response) {
	  	console.log(APIConfig.url + "projects/");
	  return response.data;
	});
	  return promise;
	};
}]);
