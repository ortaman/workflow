
app.controller('ProfileController', ['$scope','ProducerGetListService','UserService','ProjectListService',
'APIConfig', 'StadisticsService',
 function($scope, ProducerGetListService, UserService, ProjectListService, APIConfig, StadisticsService) {

  $scope.producersCurrentPage = 1;
  $scope.clientsCurrentPage = 1;
  $scope.currentProjectPage = 1;

  $scope.oweme = [];
  $scope.todo = [];
  $scope.projects = {}
  $scope.listForm = {
    "phase": 'Preparación'
  }


  $scope.init = function(){
    UserService.me().then(
      function(response){
        $scope.user = response;
        $scope.performancePageChanged($scope.clientsCurrentPage, 'oweme');
        $scope.performancePageChanged($scope.producersCurrentPage, 'todo');
        $scope.projectPageChanged();
      }
    )
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

  $scope.projectPageChanged = function() {

		var query = {
			"page": $scope.currentProjectPage,
			"phase": $scope.listForm.phase,
      "client":$scope.user.id
		};

		ProjectListService.getList(query).then(
			function(response) {
				$scope.projects = response
        console.log($scope.projects);
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


  $scope.onProjectSelect = function (ite) {
    $scope.projectPageChanged();
  }
}]);
