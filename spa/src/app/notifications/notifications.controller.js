
app.controller('NotificationsController', ['$scope', '$timeout',
 function($scope ,$timeout) {

          $scope.options = {
            debug: true,
            timenav_position: 'top',
            language: 'es'
          };

          $timeout(function () {
            var data = {
              'events': [
                {
                'media': {
                  'url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4_XRvUoHrrulZEh9z6wF_Pta_oy9CgveqgXTLIeHlQLxe5Ev1'
                },
                'start_date': {
                  'year': '2017',
                  'month': '1',
                  'day': '1'
                },
                'text': {
                  'headline': 'Creación de proyecto',
                  'text': '<p>El usuario juan ha creado el proyecto  "Áreas de Oportunidad Comercial"</p>'
                },
              },
                {
                'media': {
                  'url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4_XRvUoHrrulZEh9z6wF_Pta_oy9CgveqgXTLIeHlQLxe5Ev1'
                },
                'start_date': {
                  'year': '2017',
                  'month': '3',
                  'day': '1'
                },
                'text': {
                  'headline': 'Creación de accion',
                  'text': '<p>El usuario jose ha agregado la accion "Mejoras de proceso" al proyecto  "Áreas de Oportunidad Comercial"</p>'
                },
              },
             ]
            };

            $scope.timeline.setData(data);
            $scope.timeline.goTo(1);
          }, 200);

          $scope.$watch('options', function(newOptions) {
            if($scope.timeline) {
              $scope.timeline.setOptions(newOptions);
            }
          }, true);

}]);
