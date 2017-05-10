
app.service("ActionListService", ['$http', 'APIConfig', function($http, APIConfig) {

	var getColor = function (action) {
			if(moment(action.report_at).isBefore(moment()) && action.report == 0)
				return 'red'

			if(moment(action.report_at).isAfter(moment()) && action.report == 0)
				return 'yellow'

		return 'green'
	}

	this.getList = function(object) {
		var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/?" + params).then(function(response) {
			angular.forEach(response.data.results, function(item){

				item.project.image = APIConfig.baseUrl+ item.project.image;
				item.producer.photo = APIConfig.baseUrl+ item.producer.photo;
				item.client.photo = APIConfig.baseUrl+ item.client.photo;
				item.color = getColor(item);
			})
	  return response.data;
	});
	  return promise;
	};

}]);
