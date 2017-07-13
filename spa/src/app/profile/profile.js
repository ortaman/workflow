
app.controller('ProfileController', ['$scope','ProducerGetListService','UserService','ActionService',
 'StadisticsService', 'ProjectService', '$state',
 function($scope, ProducerGetListService, UserService, ActionService, StadisticsService, ProjectService,  $state) {

  $scope.producersCurrentPage = 1;
  $scope.clientsCurrentPage = 1;
  $scope.currentProjectPage = 1;

  $scope.oweme = [];
  $scope.todo = [];
  $scope.projects = {}



  $scope.init = function(){
    if($state.params.id){
      UserService.get($state.params.id).then(
        function(response){
          $scope.user = response;
          $scope.performancePageChanged($scope.clientsCurrentPage, 'oweme');
          $scope.performancePageChanged($scope.producersCurrentPage, 'todo');
          $scope.projectPageChanged();
        }
      )
    }else{
      UserService.me().then(
        function(response){
          $scope.user = response;
          $scope.performancePageChanged($scope.clientsCurrentPage, 'oweme');
          $scope.performancePageChanged($scope.producersCurrentPage, 'todo');
          $scope.projectPageChanged();
        }
      )
    }
  }

  $scope.performancePageChanged = function(page, list) {
    if (list == 'todo') {

      StadisticsService.todo().then(
        function(response) {
          $scope[list] = response;
        },
        function(errorResponse) {
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
      );
    }else if(list =='oweme'){

      StadisticsService.oweme().then(
        function(response) {
          $scope[list] = response;
        },
        function(errorResponse) {
          $scope.status = errorResponse.statusText || 'Request failed';
          $scope.errors = errorResponse.data;
        }
      );
    }
  };

  $scope.projectPageChanged = function(status) {
    let defaultStatus = 'Pendiente';
		var query = {
			"page": $scope.currentProjectPage,
      "client_id":$scope.user.id,
      "status":status || defaultStatus
		};

		ProjectService.getList(query).then(
			function(response) {
				$scope.projects = response
			},
			function(errorResponse) {
				console.error('errorResponse', errorResponse);
				$scope.status = errorResponse.statusText || 'Request failed';
				$scope.errors = errorResponse.data;
			}
		);

	};
  $scope.chunkArray = function(index) {
    if($scope.projects.results)
      return $scope.projects.results.slice(index*3, (index*3)+3);
  }

  $scope.getSize = function () {
    if($scope.projects.results){
      return new Array(Math.ceil($scope.projects.results.length/3));
    }
  }



}]);
