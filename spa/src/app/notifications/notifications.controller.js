
app.controller('NotificationsController', ['$scope',
 function($scope) {
   $scope.events = [{
     badgeClass: 'info',
     badgeIconClass: 'glyphicon-check',
     title: 'First heading',
     content: 'Some awesome content.',
     side:'left'
   }, {
     badgeClass: 'warning',
     badgeIconClass: 'glyphicon-credit-card',
     title: 'Second heading',
     content: 'More awesome content.',
     side:'right'
   }];

}]);
