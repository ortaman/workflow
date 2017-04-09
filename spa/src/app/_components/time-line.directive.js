app.directive("jqueryDate", ['$compile',function ($compile,$scope) {
    return {
        scope: {
            jqueryDate: "="
        },
        link: function (scope, element, attributes) {
            var date = moment(scope.jqueryDate);
            attributes.$set('data-date', date.format('DD/MM/YYYY'));
        }
    }
}]);
