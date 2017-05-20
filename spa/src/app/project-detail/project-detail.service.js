
app.service("ProjectGetService", ['$http', 'APIConfig', function($http, APIConfig) {

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
