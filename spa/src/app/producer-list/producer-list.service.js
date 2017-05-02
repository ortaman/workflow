
app.service("ProducerGetListService", ['$http', 'APIConfig', function($http, APIConfig) {
  this.getList = function(object) {
    var params = $.param(object);

    var promise = $http.get(APIConfig.url + "producers/?" + params).then(function(response) {

			for (var i=0; i < response.data.producers.length; i++) {
				response.data.producers[i].producer.photo = APIConfig.baseUrl + response.data.producers[i].producer.photo;
			}
      return response.data;
    });

    return promise;
  };
}]);
