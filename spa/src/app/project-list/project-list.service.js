
app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.getList = function() {
	  var promise = $http.get(APIConfig.url + "projects/").then(function(response) {
	  	console.log(APIConfig.url + "projects/");
	  return response.data;
	});
	  return promise;
	};
}]);
