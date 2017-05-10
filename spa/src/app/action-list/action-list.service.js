
app.service("ActionListService", ['$http', 'APIConfig', function($http, APIConfig) {

	this.getList = function(object) {
		var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/?" + params).then(function(response) {
			angular.forEach(response.data.results, function(item){
				console.log(item);

				item.project.image = APIConfig.baseUrl+ item.project.image;
				item.producer.photo = APIConfig.baseUrl+ item.producer.photo;
				item.client.photo = APIConfig.baseUrl+ item.client.photo;
			})
	  return response.data;
	});
	  return promise;
	};

}]);
