
app.service("ActionListService", ['$http', 'APIConfig', function($http, APIConfig) {

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
	  var promise = $http.get(APIConfig.url + "actions/?" + params).then(function(response) {
			angular.forEach(response.data.results, function(item){

				item.project.image = APIConfig.baseUrl+ item.project.image;
				item.producer.photo = APIConfig.baseUrl+ item.producer.photo;
				item.client.photo = APIConfig.baseUrl+ item.client.photo;
				console.log(item);
				item.color = getColor(item);
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

}]);
