
app.service('UserService', function($http, APIConfig,$q) {

    this.search = function(name) {
        var results = undefined;
        var deferred = $q.defer();
        URL = APIConfig.url + 'users/';

        $http.get(URL+'?first_surname='+name)
          .then(function(result) {
            results = result.data;
            deferred.resolve(results);
          }, function(error) {
            results = error;
            deferred.reject(error);
          });

        results = deferred.promise;
      return $q.when(results);
    };

});
