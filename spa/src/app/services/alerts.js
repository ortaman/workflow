app.service("AlertsService", ['$http', 'APIConfig', function($http, APIConfig) {

  var actionKindText = {
    'Before': 'Acción por terminar',
    'Deadline': 'Terminó',
    'After': 'Expirado',
  }

  var projectKindText = {
    'Before': 'Proyecto por terminar',
    'Deadline': 'Terminó proyecto',
    'After': 'Expirado',
  }

  var icons = {
    'Before': 'close',
    'Deadline': 'check',
    'After': 'clock',
  }

  var getIconStatus = function (item) {
    return icons[item.kind];
  }

  var getAlertText = function (item) {
    if(item.action.parent_action){
      return actionKindText[item.kind] + "("+ item.action.name+")"
    }
    return projectKindText[item.kind]+  "("+ item.action.name +")";
  }

  this.getList = function(object) {
	  var params = $.param(object);
	  var promise = $http.get(APIConfig.url + "actions/alerts/?" + params).then(function(response) {
        angular.forEach(response.data.results, function (item) {
          item.iconStatus = getIconStatus(item);
          item.alertText = getAlertText(item);
        })
	     return response.data;
	  });
	  return promise;
	};


  this.update = function(object) {
    var promise = $http.put(APIConfig.url + "actions/alerts/" + object.id + "/" , object).then(function(response) {
      return response.data;
    });
    return promise;
  };

}]);
