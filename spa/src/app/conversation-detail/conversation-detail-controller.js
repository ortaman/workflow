
app.controller('ConversationDetailController', ['$scope', '$timeout', 'ActionService', 'Notification', 'ProjectService',
  '$state', 'MessagesService', 'UserService', 'APIConfig',
  function ($scope, $timeout, ActionService, Notification, ProjectService, $state, MessagesService, UserService, APIConfig) {

    $scope.scrollChat = null;
    $scope.user = {};
    $scope.currentPage = 1;
    let enableScroll = true;

    $scope.init = function () {
      UserService.me().then(function (response) {
        $scope.user = response.id
        getMessages($scope.currentPage).then(response => {
          $scope.messages = response;/* 
          angular.element(document.querySelector('#'));
          $('#scrollChat').scrollTop(50, 200) */
        })
        getProject();
      }, function (error) {

      })

    }

    $scope.$watch('scrollChat', function (value) {
      if (value == 'top' && enableScroll) {
        $scope.currentPage += 1;
        $scope.scrollChat = null;

        $scope.projectsProducerPromise = getMessages($scope.currentPage)
          .then(response => {
            $scope.messages.results = response.results.concat($scope.messages.results);
          })
          .catch(error => {
            enableScroll = false;
          })
      }
    })

    let getMessages = function (currentPage) {
      return MessagesService.getList(
        {
          action_id: $state.params.id,
          page: currentPage
        });
    }

    var getProject = function () {
      ActionService.getById($state.params.id).then(
        function (response) {
          $scope.action = response;
        },
        function (errorResponse) {
          Notification.error("Ocurrio  un error al recuperar  información")
        }
      );
    }

    $scope.submitMessage = function (message) {
      MessagesService.create(
        {
          message: message,
          action: $state.params.id
        }
      ).then(function (newMessage) {

        $scope.message = '';
        newMessage.created_by.photo = APIConfig.baseUrl + newMessage.created_by.photo;
        $scope.messages.results.push(newMessage);
      })
    }

  }]);
