
app.controller('ConversationsController', ['$scope', 'MessagesService', 'ProjectService',
 function($scope, MessagesService, ProjectService) {

   $scope.init = function () {
     $scope.getProjects();
   }

  $scope.getProjects = function(){
    var query = {}
    ProjectService.getList(query).then(
      function(response) {
        $scope.projects = response;
      },
      function(errorResponse) {
        console.log('errorResponse', errorResponse);
      }
    );
  }

$scope.onProjectSelect =  function (project) {
  project = JSON.parse(project);
  $scope.project = project;
}

}]);
