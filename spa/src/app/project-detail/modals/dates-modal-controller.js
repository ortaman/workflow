
app.controller('DatesModalController', ['$scope','$mdDialog','project', 'type',
  function($scope,$mdDialog, project, type) {
    var $ctrl = this;
    $ctrl.project = project

    $ctrl.itemType = {
      "project":{
        'name':'project',
        'title':'Fechas de proyecto '
      },
      "action":{
        'name':'action',
        'title':'Fechas de acción '
      }
    }
    $ctrl.itemType = $ctrl.itemType[type];

}]);
