
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
        if(StorageService.get('user')){
          results = JSON.parse(StorageService.get('user'));

          deferred.resolve(results);
        }else{
          $http.get(URL)
            .then(function(result) {
              results = result.data;
              results.photo =  APIConfig.baseUrl+ results.photo
              StorageService.set('user',JSON.stringify(results))

              deferred.resolve(results);
            }, function(error) {
              results = error;
              deferred.reject(error);
            });
            results = deferred.promise;
        }
      return $q.when(results);
    };


    this.getList = function(params) {
        var results = undefined;
        var deferred = $q.defer();
        URL = APIConfig.url + 'users/';

        $http.get(URL+'?'+ params)
          .then(function(result) {
            results = result.data;
            angular.forEach(results.results, function(user){
              user.photo = APIConfig.baseUrl+ user.photo
            })
            deferred.resolve(results);
          }, function(error) {
            results = error;
            deferred.reject(error);
          });

        results = deferred.promise;
      return $q.when(results);
    };

    this.create = function(object) {
        var promise = $http.post(URL, object).then(function(response) {
            return response;
        });

        return promise;
    };
});
