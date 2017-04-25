
app.service("ActionGetService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.getById = function(id) {
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

            response.data.producer.photo = APIConfig.baseUrl + response.data.producer.photo;
    				response.data.project.image = APIConfig.baseUrl + response.data.project.image;

            return response.data;
        });

        return promise;
    }



}]);
