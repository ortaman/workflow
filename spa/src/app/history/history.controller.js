
app.controller('HistoryController', ['$scope', '$timeout', 'ActionService', 'Notification', 'ProjectService',
 function($scope ,$timeout, ActionService, Notification, ProjectService) {

   $scope.notifications = [];
   $scope.listForm = {},
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
     $scope.getNotifications(project);
   }

   $scope.getNotifications = function (project) {
 	  	let query = {
 	  		"project_id": project.id,
 				'begin_date': moment(project.begin_at).format('YYYY-MM-DD'),
 	      'end_date': moment(project.accomplish_at).format('YYYY-MM-DD'),
 	  	};

   		ActionService.getList(query).then(
   			function(response) {
   				$scope.historyArray = angular.copy(response);
   				$scope.historyArray.push(project)
   			},
   			function(errorResponse) {
          Notification.error("Error al recuperar resultados, intente más tarde")
   			}
   		);

    }


}]);
