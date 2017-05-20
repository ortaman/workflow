
app.service("ProjectListService", ['$http', 'APIConfig', function($http, APIConfig) {

	var statusList = ['Terminada', 'Satisfactoria',  'Insatisfactoria']

	var getColor = function (project) {

			if(moment(project.accomplish_at).isBefore(moment())){
				angular.forEach(statusList, function(status){
					if (project.status == status)
						return 'green'
				})

				if(project.report == 0 )
					return 'red';
			}

			else if(moment(project.report_at).isBefore(moment()))
				return 'green';

			else if(moment(project.report_at).isBefore(moment()) && project.report == 0 )
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
