
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
                object[key] = new moment(value).format("YYYY-MM-DD");
            })
        });

        var promise = $http.post(APIConfig.url + "actions/", object).then(function(response) {
            return response;
        });

        return promise;
    };


    this.update = function(id,object) {
      var transformFields = ['project', 'producer', 'client', 'observer'];
      var transformDateFields = ['accomplish_at','begin_at', 'report_at'];

        angular.forEach(transformFields, function(item){
          if (object[item] && typeof object[item] != 'number')
              object[item] = object[item].id
        })
        angular.forEach(transformDateFields, function(item){
              object[item] = moment(object[item]).format('YYYY-MM-DD')
        })

        var promise = $http.patch(APIConfig.url + "actions/"+id+"/", object).then(function(response) {
            return response;
        });

        return promise;
    };

}]);
