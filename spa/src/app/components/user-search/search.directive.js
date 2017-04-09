

app.directive('userSearch', ['URLTemplates', 'UserListService', '$timeout',

  /** @ngInject */
  function userSearch(URLTemplates, UserListService, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/components/user-search/search.html',
      scope: {
          fieldName: '@',
          userId: '=',
          userInit: '=',
      },
      controller: SearchUserController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function SearchUserController() {
      var vm = this;

      $timeout( function(){
        vm.selectedItem = vm.userInit;
      }, 2000 );
      // ******************************
      // Internal methods
      // ******************************

      vm.querySearch = function(searchText) {

        var query = {
          'first_surname':vm.searchText
        }

        UserListService.getList(query).then(
          function(response) {
            vm.results = response.results;
          },
          function(errorResponse) {
            vm.error = errorResponse.statusText || 'Request failed.';
            console.log('response', errorResponse);
          }
        );

      };

      vm.selectedItemChange = function(item) {
        if(item)
          vm.userId = item.id;
      };

    }

  }

]);
