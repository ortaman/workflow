

app.directive('peopleSearch', ['URLTemplates',

  function peopleSearch(URLTemplates) {
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

      scope.selectedItemChange = function(user) {
        scope.userId = user.id;
      }

      scope.query = function (query) {
        return [
            {
              "id": 6,
              "username": "user3",
              "email": "user3@user.com",
              "name": "nombre",
              "first_surname": "apellido I",
              "second_surname": "apellido II"
          },
        ]
      }
    }
  }

]);
