

app.directive('userSearch', ['URLTemplates', 'UserListService',

  /** @ngInject */
  function userSearch(URLTemplates, UserListService) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/components/user-search/search.html',
      scope: {
          fieldName: '@',
          userId: '=',
      },
      controller: SearchUserController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function SearchUserController() {
      var vm = this;

      vm.selectedItem  = null;
      vm.searchText    = null;

      // ******************************
      // Internal methods
      // ******************************

      vm.querySearch = function(searchText) {

        var query = {
          'first_surname':vm.searchText
        }

        UserListService.getList(query).then(
          function(response) {
            console.log('response.results', response.results);
            vm.results = response.results;
          },
          function(errorResponse) {
            console.log('response', errorResponse);
            vm.error = errorResponse.statusText || 'Request failed.';
          }
        );

      };

      vm.selectedItemChange = function(item) {
        vm.userId = item.id;
      };

    }

  }
  
]);
