app.directive("panelLoader", ['$compile',function ($compile,$scope) {
    return {
       restrict: 'A',
        scope: {
            panelLoader: "="
        },
        link: function (scope, element, attributes) {
          var template ='<div  layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div>';

            scope.$watch('panelLoader', function (val) {
              element.append($compile(template)(scope));

                scope.panelLoader.then(function functionName() {
                    element = angular.element(element)
                    var child = element.children().length;
                    element.children()[child-1].remove();

                }, function () {
                  console.log("fail");
                })

            })
        }
    }
}]);
