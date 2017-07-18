

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
        debug: false,
        timenav_position: 'top',
        language: 'es'
      };

      var dateFields = {
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
          angular.forEach(dateFields, function(key, value){
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
          vm.timeline.setOptions(vm.options);

          vm.timeline.goTo(0);
        }, 200);

      }

        var time = $scope.$watch( 'vm.history', function () {
          if(vm.history ){
              vm.history = transformActions(vm.history);
          }
        });

    }
  }

]);
