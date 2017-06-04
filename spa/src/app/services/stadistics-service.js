
app.service("StadisticsService", ['$http', 'APIConfig', function($http, APIConfig) {

	this.get = function(object = {}) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/stadistics?" + params).then(function(response) {
	  return response.data;
	});
	  return promise;
	};

	var getPhoto = function (client) {

	}

	var getPercentage = function (item) {
    var result = 0 ;
    result = (item.satisfactories*100)/(item.pending+ item.unsatisfactories+ item.satisfactories)
    result = isNaN(result) ? 0 : result;
    return result;
  }

	this.todo = function(object = {}) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/stadistics/todo" + params).then(
			function(response) {
				response.data.to_do.forEach(function(item){
					item.client.photo = APIConfig.baseUrl + item.client.photo;
					item.succesfulPercentage = getPercentage(item)

				})
	  		return response.data;
			}
		);
	  return promise;
	};

	this.oweme = function(object = {}) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/stadistics/oweme" + params).then(
			function(response) {
				response.data.owe_me.forEach(function(item){
					item.producer.photo = APIConfig.baseUrl + item.producer.photo;
					item.succesfulPercentage = getPercentage(item)

				})
	  		return response.data;

			}
		);
	  return promise;
	};

}]);
