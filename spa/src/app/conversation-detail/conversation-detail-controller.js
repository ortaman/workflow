
app.controller('ConversationDetailController', ['$scope', '$timeout', 'ActionService', 'Notification', 'ProjectService',
 '$state', 'MessagesService', 
 function($scope ,$timeout, ActionService, Notification, ProjectService, $state, MessagesService) {

  $scope.init = function(){
    $scope.getMessages();
  }

  $scope.getMessages = function(){
    MessagesService.getList({}).then(function(response){
      console.log("respnse", response)
    })
  }

}]);
