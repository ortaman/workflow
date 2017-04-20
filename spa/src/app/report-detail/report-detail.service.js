
app.service("ReportGetService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.getById = function(id) {
        var promise = $http.get(APIConfig.url + "reports/" + id + "/").then(function(response) {
            return response.data;
        });

        return promise;
    }

    this.getList = function(object) {
  		var params = $.param(object);
  	  var promise = $http.get(APIConfig.url + "reports/?" + params).then(function(response) {
  	  return response.data;
  	});
  	  return promise;
  	};


}]);
