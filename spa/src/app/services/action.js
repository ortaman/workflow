
app.service("ActionService", ['$http', 'APIConfig', function($http, APIConfig) {


  var getColor = function (project) {

      if(moment(project.accomplish_at).isBefore(moment())){
          if (!project.advance_report_at)
            return 'red'

          if(moment(project.advance_report_at).isAfter(project.accomplish_at))
            return 'yellow';
      }

      else if(moment(project.report_at).isBefore(moment()) && !project.advance_report_at )
        return 'yellow';

    return 'green'
  }


  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "actions/", object).then(function(response) {
      return response.data;
    });

    return promise;
  };


  this.patch = function(id, object) {

    if(typeof(object.client) != Number)
        object.client = object.client.id;

    if(typeof(object.producer) != Number)
        object.producer = object.producer.id;

    if(object.observer && typeof(object.observer) != Number)
        object.observer = object.observer.id;

    delete(object.image)
      var promise = $http.patch(APIConfig.url + "actions/" + id + "/" , object).then(function(response) {
          return response.data;
      });

      return promise;
  };

  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "actions/" + id + "/").then(
      function(response) {
        response.data.client.photo = APIConfig.baseUrl + response.data.client.photo;
        response.data.producer.photo = APIConfig.baseUrl + response.data.producer.photo;
        response.data.image = APIConfig.baseUrl + response.data.image;
        if (response.data.project)
          response.data.project.image = APIConfig.baseUrl + response.data.project.image;
        response.data.color = getColor(response.data);
      return response.data;
      }
    );

    return promise;
  }


	this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "actions/?" + params).then(function(response) {
		angular.forEach(response.data.results, function(project){
			project.image = APIConfig.baseUrl + project.image;
			project.producer.photo = APIConfig.baseUrl + project.producer.photo;
			project.client.photo = APIConfig.baseUrl + project.client.photo;
			project.color = getColor(project);
		})
		if(response.data.length){
			angular.forEach(response.data, function (project) {
				project.color = getColor(project);
			})
		}
	  return response.data;
	});
	  return promise;
	};


  this.update = function(id, object) {
    if(typeof(object.project) != Number)
        object.project = object.project.id;

    var promise = $http.put(APIConfig.url + "actions/" + id + "/" , object).then(function(response) {
      return response.data;
    });

    return promise;
  };

	this.getProjectStadistics = function() {
		var promise = $http.get(APIConfig.url + "actions/stadistics/time").then(function(response) {
			return response.data;
		});

		return promise;
	}


}]);
