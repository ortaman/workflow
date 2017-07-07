
app.service('UserService', function($http, APIConfig,$q, StorageService) {

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


    this.create = function(object) {
        URL = APIConfig.url + 'users/';

        var promise = $http.post(URL, object).then(function(response) {
            return response;
        });

        return promise;
    };

    this.update = function(object, id) {
        var URL = APIConfig.url + 'users/'+ id +"/";

        var promise = $http.put(URL, object).then(function(response) {
            return response;
        });

        return promise;
    };

    this.get = function (id) {
      var promise = $http.get(APIConfig.url + "users/" + id + "/").then(function(response) {
        response.data.photo = APIConfig.baseUrl + response.data.photo;
        return response.data;
      });
      return promise;
    }

    this.getList = function(object) {
      var params = $.param(object);

      var promise = $http.get(APIConfig.url + "users/?" + params).then(function(response) {
        angular.forEach(response.data.results, function(user){
          user.photo = APIConfig.baseUrl+ user.photo
        })
        return response.data;
      });

      return promise;
    };
});
