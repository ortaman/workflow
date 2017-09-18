app.directive("scrollable", function () {
    return {
        restrict: 'A',
        scope: {
            scrollable: "="
        },
        link: function (scope, element, attrs) {
            let container = angular.element(element);
            container.bind("scroll", function (evt) {
                if (container[0].scrollTop <= 0) {
                    scope.$apply(scope.scrollable = 'top');
                }
            });
        }
    }
})