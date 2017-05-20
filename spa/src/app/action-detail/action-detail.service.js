
app.service("ActionGetService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.getById = function(id) {

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

        var promise = $http.get(APIConfig.url + "actions/" + id + "/").then(function(response) {

            var transformFields = [
                'accomplish_at',
                'expire_at',
                'renegotiation_at',
                'report_at',
                'begin_at'
            ];
            angular.forEach(response.data, function(value, key) {
                transformFields.forEach(function(item) {
                    if(key == item) {
                        var d = new Date(value);
                        response.data[key] = new Date(d.getTime() + d.getTimezoneOffset() *60*1000);
                    }
                })
            });

            response.data.color = getColor(response.data);

            response.data.producer.photo = APIConfig.baseUrl + response.data.producer.photo;
            response.data.client.photo = APIConfig.baseUrl + response.data.client.photo;
    				response.data.project.image = APIConfig.baseUrl + response.data.project.image;

            return response.data;
        });

        return promise;
    }



}]);
