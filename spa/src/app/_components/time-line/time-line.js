

app.directive('history', [

  /** @ngInject */
  function history() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/_components/time-line/time-line.html',
      scope: {
          history: '='
      },
      controller: TimeLineController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TimeLineController(APIConfig , $scope, $timeout) {
      var vm = this;

      vm.options = {
        debug: true,
        timenav_position: 'bottom',
        language: 'es'
      };

      var dateFields = {
          'accomplish_at':'Fecha de ejecución',
          'report_at':'Fecha de reporte',
          'begin_at':'Fecha de inicio',

          'preparation_at' : 'Fecha de Preparación',
          'negotiation_at' : 'Fecha de Negociación',
          'execution_at' : 'Fecha de Ejecución',
          'evaluation_at' : 'Fecha de Evaluación',

          'accepted_at' : 'Proyecto aceptado',
          'qualified_at' : 'Proyecto calificado',

        };

      var dateFields2 = {
          'accomplish_at':{
            'name':'Fecha de ejecución',
            'image': 'client'
          },
          'report_at':{
            'image': 'client',
            'name':'Fecha de reporte',
          },
          'begin_at':{
            'name': 'Fecha de inicio',
            'image': 'client'
          },

          'preparation_at' : {
            'name':'Fecha de Preparación',
            'image': 'client'
          },
          'negotiation_at' :{
            'name':'Fecha de Negociación',
            'image': 'client'
          },
          'execution_at' : {
            'name':'Fecha de Ejecución',
            'image': 'client'
          },
          'evaluation_at' : {
            'name':'Fecha de Evaluación',
            'image': 'client'
          },

          'accepted_at' : {
            'name':'Proyecto aceptado',
            'image': 'producer'
          },
          'qualified_at' :{
            'name': 'Proyecto calificado',
            'image': 'client'
          },

          'advance_report_at' :{
            'name': 'Reporte de avance creado',
            'image': 'producer'
          },
          'ejecution_report_at' :{
            'name': 'Reporte término creado',
            'image': 'producer'
          }

        };


      var transformActions = function(results){

        var newArray = [];
        var data = {
          events:[]
        };
        angular.forEach(results, function (result) {
          angular.forEach(dateFields2, function(key, value){
            if(result[value]){
                let event = {

                  'media': {
                    'url': result[key.image]['photo']
                  },
                  'start_date': {
                    'year': moment(result[value]).year(),
                    'month': moment(result[value]).month(),
                    'day': moment(result[value]).day()
                  },
                  'text': {
                    'headline': result.name + " ("+ key.name +")",
                    'text': '<p></p>'
                  },

              }
              data.events.push(event);


            }

          })
        })

        $timeout(function () {
          vm.timeline.setData(data);
          vm.timeline.goTo(0);
        }, 200);

      }

        var time = $scope.$watch( 'vm.history', function () {
          if(vm.history ){
              vm.history = transformActions(vm.history);
          }
        });

        $scope.$watch('vm.options', function(newOptions) {
          if(vm.timeline) {
            vm.timeline.setOptions(newOptions);
          }
        }, true);
    }
  }

]);
