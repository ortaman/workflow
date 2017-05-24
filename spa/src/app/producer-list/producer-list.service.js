
app.service("ProducerGetListService", ['$http', 'APIConfig', function($http, APIConfig) {

  //get
  var getPercentage = function (producer) {
    var result = 0 ;
    result = (producer.satisfactories*100)/(producer.pending+ producer.unsatisfactories+ producer.satisfactories)
    result = isNaN(result) ? 0 : result;
    return result;
  }

  this.getList = function(object) {
    var params = $.param(object);

    var promise = $http.get(APIConfig.url + "producers/?" + params).then(function(response) {

			for (var i=0; i < response.data.producers.length; i++) {
				response.data.producers[i].producer.photo = APIConfig.baseUrl + response.data.producers[i].producer.photo;
				response.data.producers[i].succesfulPercentage = getPercentage(response.data.producers[i])
			}
      return response.data;
    });

    return promise;
  };
}]);
