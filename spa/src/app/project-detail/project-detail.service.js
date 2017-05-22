
app.service("ProjectGetService", ['$http', 'APIConfig', function($http, APIConfig) {


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


  this.getById = function(id) {
    var promise = $http.get(APIConfig.url + "projects/" + id + "/").then(
      function(response) {
        response.data.client.photo = APIConfig.baseUrl + response.data.client.photo;
        response.data.color = getColor(response.data);
      return response.data;
      }
    );

    return promise;
  }

}]);
