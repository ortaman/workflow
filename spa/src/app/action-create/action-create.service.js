
app.service("ActionCreateService", ['$http', 'APIConfig', function($http, APIConfig) {
  
    this.create = function(object) {

        var transformFields = [
            'begin_at',
            'accomplish_at', 
            'report_at', 
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
