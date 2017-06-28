

app.service("ProjectService", ['$http', 'APIConfig', function($http, APIConfig) {

  this.getSuggestedDates = function (begin_at, accomplish_at) {
      let suggestedDatesObj = {};
      let executionDate = moment(accomplish_at);
      let beginDate = moment(angular.copy(begin_at));
      var daysOfDiference = Math.round(executionDate.diff(beginDate, 'days'))
      console.log("diferencia ", daysOfDiference)

      suggestedDatesObj.preparation_at = angular.copy(beginDate).add(Math.round(daysOfDiference * .10), 'd').toDate();
      suggestedDatesObj.negotiation_at = angular.copy(beginDate).add(Math.round(daysOfDiference * .20), 'd').toDate();
      suggestedDatesObj.execution_at = angular.copy(executionDate).add(Math.round(daysOfDiference * 0), 'd').toDate();
      suggestedDatesObj.evaluation_at = angular.copy(executionDate).add(Math.round(daysOfDiference * .10), 'd').toDate();
      suggestedDatesObj.renegotiation_at =  angular.copy(beginDate).add(Math.round(daysOfDiference * .50), 'd').toDate();
      suggestedDatesObj.report_at = beginDate.add(Math.round(daysOfDiference * .50), 'd').toDate();

    return suggestedDatesObj;
  }

  var getColor = function (project) {

  //  advance_report_at
  //  ejecution_report_at

      if(moment(project.accomplish_at).isBefore(moment())){
          if (!project.advance_report_at || moment(project.advance_report_at).isAfter(moment(project.accomplish_at)))
            return 'red';

          if (!project.ejecution_report_at || moment(project.ejecution_report_at).isAfter(moment(project.accomplish_at)))
            return 'red';
      }

      if(moment(project.report_at).isBefore(moment()) && !project.ejecution_report_at){
          if (!project.advance_report_at || moment(project.advance_report_at).isAfter(moment(project.report_at)))
            return 'yellow';
      }

    return 'green'
  }


  this.create = function(object) {
    var promise = $http.post(APIConfig.url + "projects/", object).then(function(response) {
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
      var promise = $http.patch(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
          return response.data;
      });

      return promise;
  };

  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(
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


  this.update = function(id, object) {
    var promise = $http.put(APIConfig.url + "projects/" + id + "/" , object).then(function(response) {
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
