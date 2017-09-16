
app.service('AuthService', function($http, $q,  APIConfig) {

  var url = APIConfig.url + 'token-auth/'

  this.login = function(data) {

      var deferred = $q.defer();

      $http.post(url, data).then(function(response) {
          deferred.resolve(response);
        }, function(errorResponse) {
          deferred.reject(errorResponse);
        });

      var promise = deferred.promise;

    return promise
  };

});

app.factory('authHttpResponseInterceptor',['$q','$injector',function($q, $injector){
	return {
		response: function(response){
			if (response.status === 403) {
				console.log("Response 403");
			}
			return response || $q.when(response);
		},
		responseError: function(rejection) {
			if (rejection.status === 403) {
        let msjNotification = $injector.get('Notification');
        msjNotification.error("No tiene permisos para realizar esta acción")
			}
			return $q.reject(rejection);
		}
	}
}])
