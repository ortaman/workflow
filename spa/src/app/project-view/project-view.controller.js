
app.controller('ProjectViewController', [
  '$scope', '$state', 'ActionService','APIConfig','Notification', 'ProjectService',
  function($scope, $state, ActionService, APIConfig,Notification, ProjectService) {
    var type  =  'project';
    var Service = ProjectService
    $scope.titles = {
      'project': {
        'type':'project',
        'name':  'Proyecto',
        'update':  'Detalle de Proyecto',
        'nameOf':  'Nombre del proyecto',
        'roles':  'Roles del Proyecto ',
      },
      'action':{
        'type':'action',
        'name':  'Acción',
        'update':  'Detalle de Acción',
        'nameOf':  'Nombre de la acción',
        'roles':  'Roles de la acción ',

      }
    }

    var transformFields = [
        'preparation_at',
        'negotiation_at',
        'execution_at',
        'evaluation_at',

        'accomplish_at',
        'renegotiation_at',
        'report_at',
        'begin_at',
    ];

    $scope.getProjectByIdInit = function() {
      ActionService.getById($state.params.id).then(
        function(response) {

          angular.forEach(response, function(value, key) {
              transformFields.forEach(function(item) {

              if(key == item) {
                var d = new Date(value);
                response[key] = new Date(d.getTime() + d.getTimezoneOffset() *60*1000);
              }

            })

          });
          response.image = APIConfig.baseUrl + response.image;// TODO: cambiar  imagen
          type  = response.parent_action == null ? 'project':'action'
          if (!$scope.isProject())
            Service = ActionService
          $scope.titles = $scope.titles[type];
          $scope.project = response;
        },
        function(errorResponse) {
          console.error('errorResponse', errorResponse);
          var status = errorResponse.statusText || 'Request failed';
          var errors = errorResponse.data;
        }
      );
    }

    ////////////////////end dates validations///////////////////////
    $scope.isProject = function(){
      if (type == 'project')
        return true;
      return false ;
    }
}]);
