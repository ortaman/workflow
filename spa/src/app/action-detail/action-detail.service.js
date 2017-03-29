
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
                transformFields.forEach(function(item){
                    if(key == item)
                    response.data[key] = new Date(response.data[key]);
                })
            });

            return response.data;
        });

        return promise;
    }

}]);
