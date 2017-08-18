
app.controller('ConversationDetailController', ['$scope', '$timeout', 'ActionService', 'Notification', 'ProjectService',
 '$state', 'MessagesService', 'UserService',
 function($scope ,$timeout, ActionService, Notification, ProjectService, $state, MessagesService, UserService) {

  $scope.user = {}
  $scope.init = function(){
    UserService.me().then(function(response){
        $scope.user = response.id
        $scope.getMessages();
        getProject();
    }, function(error){
      
    })

  }

  
  $scope.getMessages = function(){
    MessagesService.getList(
      {
        action_id:  $state.params.id
      }).then(function(response){
        $scope.messages = response;
    })
  }

  var getProject = function() {
		ActionService.getById($state.params.id).then(
			function(response) {
				$scope.action = response;
			},
			function(errorResponse) {
				Notification.error("Ocurrio  un error al recuperar  información")
			}
		);
  }
  
  $scope.submitMessage = function(message){
    MessagesService.create(
      {
        message: message,
        action: $state.params.id
      }
    ).then(function(newMessage){
      $scope.message = '';
      $scope.messages.results.push(newMessage);
    })
  }

}]);
