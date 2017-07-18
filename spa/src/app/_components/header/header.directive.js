

app.directive('myHeader', ['UserService','AlertsService','Notification',

  /** @ngInject */
  function myHeader() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/_components/header/header.html',
      scope: {
          creationDate: '='
      },
      controller: HeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController(APIConfig, $state, StorageService, UserService, AlertsService, Notification) {
      var vm = this;
      UserService.me().then(function(result){
        vm.user = result
      })

      if (!StorageService.get('token')) {
        $state.go('login');
      }

      vm.getAlerts = function () {
        let query = {
          page: 1
        }
        AlertsService.getList(query).then(
          function (response) {
            vm.alerts = response;
          },
          function (error) {
            Notification.error("Ocurrio un  error, intente mas tarde");
          }
        );
      }

      vm.logout = function() {
        StorageService.remove('token');
        StorageService.remove('user');
        $state.go('login');
      }

      vm.updateAlert = function (alert) {
        alert.viewed = true;
        AlertsService.patch(alert.id, alert).then(
          function (response) {
            $state.go('projectDetail', {id:alert.action.id});
          },
          function(error){
            console.error(error);
            Notification.error("Ocurrio un  error, intente mas tarde");
          }
        )
      }

    }
  }
]);
