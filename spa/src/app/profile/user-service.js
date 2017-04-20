
app.service('UserService', function($http, APIConfig,$q, StorageService) {

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


    this.me = function() {
        var results = undefined;
        var deferred = $q.defer();
        URL = APIConfig.url + 'myuser/';

        if(StorageService.get('userks')){
          results = JSON.parse(StorageService.get('userks'));
          deferred.resolve(results);
        }else{
          $http.get(URL)
            .then(function(result) {
              results = result.data;
              StorageService.set('userks',JSON.stringify(results))
              deferred.resolve(results);
            }, function(error) {
              results = error;
              deferred.reject(error);
            });
            results = deferred.promise;
        }


      return $q.when(results);
    };

});
