
app.service("ProjectGetService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(function(response) {
      return response.data;
    });

    return promise;
  }

}]);

app.service("ProducerGetListService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "projects/?" + params).then(function(response) {
      var a = [
        {
          "user":"juan1",
        },
        {
          "user":"juan2",
        },
        {
          "user":"juan3",
        },
        {
          "user":"juan4",
        },
        {
          "user":"juan5",
        },
        {
          "user":"juan6",
        },
      ];

	  return a;
	});
	  return promise;
	};

}]);
