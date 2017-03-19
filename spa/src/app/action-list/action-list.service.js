
app.service("ActionService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.getList = function() {
	  var promise = $http.get(APIConfig.url + "actions/").then(function(response) {
	  	console.log(APIConfig.url + "actions/");
	  return response.data;
	});
	  return promise;
	};
}]);

/*
app.service("ActionService", function($http, APIConfig) {
	this.save = function(action) {
	  $http.post(APIConfig.url + "api/actions/", action).then(
	    function(response) {
	      return response.data;
	    },
 	    function(errorResponse) {
        return response.data || 'Request failed';
      }
    );
	};
	this.getList = function() {
	    var promise = $http.get(APIConfig.url + "api/actions/").then(function(response) {
	    return response.data;
	  });
	    return promise;
	};
	this.getById = function() {
	    var promise = $http.get(APIConfig.url + "/api/action/").then(function(response) {
	    return response.data;
	  });
	};
	this.update = function(action, id) {
	    var promise = $http.put(APIConfig.url + "/api/action/" + id + "/", action).then(function(response) {
	    return response.data;
	  });
	};
});
*/