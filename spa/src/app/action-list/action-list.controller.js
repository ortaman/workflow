
app.controller('ActionListController', ['$scope', 'ActionListService', function($scope, ActionListService) {

  $scope.actions = [
    {
      "producer":{
        'name':"jan",
        "first_surname":"valdes",
        "position":"empleado"
      },
      'promise':{
        "kept_percent": 1,
        "kept": 2,
        "empty": 3,
        "negotiating": 4,
        "open": 5,
      }
    }
  ]
}]);
