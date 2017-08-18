app.service("MessagesService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getList = function(object) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "messages/?" + params).then(function(response) {
    angular.forEach( response.data, function(element) {
        element.created_by.photo = APIConfig.baseUrl + element.created_by.photo;
    });
	     return response.data;
	  });
	  return promise;
	};

  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "messages/", object).then(function(response) {
      return response.data;
    });

    return promise;
  };

}]);
