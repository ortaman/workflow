app.directive("jqueryDate", ['$compile',function ($compile,$scope) {
    return {
        scope: {
            jqueryDate: "="
        },
        link: function (scope, element, attributes) {
            attributes.$set('data-date', scope.jqueryDate);
        }
    }
}]);
