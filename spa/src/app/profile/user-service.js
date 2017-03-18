
app.service('UserService', function($http, APIConfig,$q) {
  URL = APIConfig.url + 'api/users/';

    var posts = undefined;
    this.search = function(data) {
        var deferred = $q.defer();

        $http.post(URL,data)
          .then(function(result) {
            posts = result.data;
            deferred.resolve(posts);
          }, function(error) {
            posts = error;
            deferred.reject(error);
          });

        posts = deferred.promise;
      return $q.when(posts);
    };

});
