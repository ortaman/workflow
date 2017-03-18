

app.directive('peopleSearch', ['URLTemplates','UserService',

  function peopleSearch(URLTemplates, UserService) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/components/people-search/search.html',
      scope: {
          userId: '=userId',
      },
      link: SearchController,
    };

    return directive;

    function SearchController(scope, element, attrs) {
      var list = [];

      scope.selectedItemChange = function(user) {
        scope.userId = user.id;
      }

      scope.query = function (query) {
        UserService.search(query).then(function (data) {
          list = data.results;
          return list;
        },function (dd) {
          console.log(dd);
        })
      }
    }
  }

]);
