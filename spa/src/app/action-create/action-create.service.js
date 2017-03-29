
app.service("ActionCreateService", ['$http', 'APIConfig', function($http, APIConfig) {
  
    this.create = function(object) {

        var transformFields = [
            'accomplish_at', 
            'expire_at', 
            'renegotiation_at', 
            'report_at', 
            'begin_at'
        ];

        angular.forEach(object, function(value, key) {
            transformFields.forEach(function(item) {
            
            if(key == item)
                object[key] = new moment(value).format("DD-MM-YYYY");
            })
        });

        var promise = $http.post(APIConfig.url + "actions/", object).then(function(response) {
            return response;
        });

        return promise;
    };

}]);
