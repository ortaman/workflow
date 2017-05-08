
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
        console.log("pidio user");
        if(StorageService.get('user')){
          results = JSON.parse(StorageService.get('user'));
          console.log("local user",results);

          deferred.resolve(results);
        }else{
          $http.get(URL)
            .then(function(result) {
              results = result.data;
              results.photo =  APIConfig.baseUrl+ results.photo
              StorageService.set('user',JSON.stringify(results))
              console.log("srver user",results);

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
