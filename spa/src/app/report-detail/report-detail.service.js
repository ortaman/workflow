
app.service("ReportGetService", ['$http', 'APIConfig', function($http, APIConfig) {

    this.getById = function(id) {
        var promise = $http.get(APIConfig.url + "reports/" + id + "/").then(function(response) {
            return response.data;
        });

        return promise;
    }



}]);
