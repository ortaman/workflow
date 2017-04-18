
app.service("ReportCreateService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.create = function(object) {
        var promise = $http.post(APIConfig.url + "reports/", object).then(function(response) {
            return response;
        });

        return promise;
    };

}]);
