
app.service("ActionListService", ['$http', 'APIConfig', function($http, APIConfig) {
	
	this.getList = function() {
	  var promise = $http.get(APIConfig.url + "actions/").then(function(response) {
	  	console.log(APIConfig.url + "actions/");
	  return response.data;
	});
	  return promise;
	};
	
}]);
