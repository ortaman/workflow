
app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {

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

	this.getList = function(object) {
	  var params = $.param(object);

	  var promise = $http.get(APIConfig.url + "projects/?" + params).then(function(response) {
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

	this.getProjectStadistics = function() {
		var promise = $http.get(APIConfig.url + "projects/stadistics/time").then(function(response) {
			return response.data;
		});

		return promise;
	}

}]);
