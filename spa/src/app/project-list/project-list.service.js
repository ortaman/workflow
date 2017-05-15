
app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {
	this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "projects/?" + params).then(function(response) {
		angular.forEach(response.data.results, function(project){
			project.image = APIConfig.baseUrl + project.image;
			project.producer.photo = APIConfig.baseUrl + project.producer.photo;
			project.client.photo = APIConfig.baseUrl + project.client.photo;
		})

	  return response.data;
	});
	  return promise;
	};

	this.getProjectStadistics = function() {
		var promise = $http.get(APIConfig.url + "projects/stadistics/time").then(function(response) {
			return response.data;
		});

		return promise;
	}

}]);
