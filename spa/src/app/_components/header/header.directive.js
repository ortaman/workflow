

app.directive('myHeader', ['URLTemplates','UserService',

  /** @ngInject */
  function myHeader(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/_components/header/header.html',
      scope: {
          creationDate: '='
      },
      controller: HeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController(APIConfig, $state, StorageService, UserService) {
      var vm = this;
      UserService.me().then(function(result){
        vm.user = result
      })

      if (!StorageService.get('token')) {
        $state.go('login');
      }

      vm.logout = function() {
        StorageService.remove('token');
        StorageService.remove('user');
        $state.go('login');
      }

    }
  }
]);
