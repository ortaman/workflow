

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
          //Fechas estáticas
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
          //Fechas estáticas//
        }
        var projectDates = {
          'accepted_at' : {
            'name':'Proyecto fue aceptado',
            'image': 'producer',
          },
          'qualified_at' :{
            'name': 'Proyecto cerrado',
            'image': 'client',
          },

          'advance_report_at' :{
            'name': 'Avance reportado',
            'image': 'producer',
          },
          'ejecution_report_at' :{
            'name': 'Proyecto  ejecutado',
            'image': 'producer',
          }
        };
        var actionDates = {
          'accepted_at' : {
            'name':'Acción fue aceptada',
            'image': 'producer',
          },
          'qualified_at' :{
            'name': 'Acción cerrada',
            'image': 'client',
          },

          'advance_report_at' :{
            'name': 'Avance reportado',
            'image': 'producer',
          },
          'ejecution_report_at' :{
            'name': 'Acción  ejecutada',
            'image': 'producer',
          }
        };

      let getStringCondition = function (action,date) {
        let text = '<p></p>';

        switch (date) {
          case 'accepted_at':
            text = `La acción fue aceptada por el realizador ${action.producer.name} ${action.producer.first_surname} ${action.producer.second_surname} `
            break;
          case 'qualified_at':
            text = `La acción fue cerrada y calificada como ${action.status} `
            break;
          case 'advance_report_at':
            let period = 'en tiempo'
            if(moment(action.advance_report_at).isAfter(moment(action.advance_report_at)))
              period = 'fuera de tiempo';
            text = `<p class="${action.color}-status-text" > Se reportó avance de ${action.reports[0].progress}, ${period} </p>`
            break;
          case 'ejecution_report_at':
            let period1 = 'en tiempo'
            if(moment(action.ejecution_report_at).isAfter(moment(action.accomplish_at)))
              period1 = 'fuera de tiempo';
              text = `<p class="${action.color}-status-text" > El realizador terminó la acción  ${period1}  </p>`
            break;
          default:

        }
        return text;
      }


      var transformActions = function(results){

        let newArray = [];
        let data = {
          events:[]
        };

        angular.forEach(results, function (action) {

          if(action.parent_action)
            dateFields = angular.extend(dateFields, actionDates);
          else
            dateFields = angular.extend(dateFields, projectDates);

          angular.forEach(dateFields, function(key, value){
            if(action[value]){
              console.log(value, "fecha",  action);
                let event = {

                  'media': {
                    'url': action[key.image]['photo']
                  },
                  'start_date': {
                    'year': moment(action[value]).format('Y')(),
                    'month': moment(action[value]).format('M')(),
                    'day': moment(action[value]).format('D')()
                  },
                  'text': {
                    'headline': action.name + " ("+ key.name +")",
                    'text': getStringCondition(action, value)
                  },

              }
              data.events.push(event);
            }

          })
        })

        return data;

      }

        var time = $scope.$watch( 'vm.history', function () {
          vm.data = {};
          if(vm.history ){
              vm.data = transformActions(vm.history);
          }
          $timeout(function () {
            if(vm.timeline ){
              console.log(vm.data);
              vm.timeline.setData(vm.data);
              vm.timeline.setOptions(vm.options);
              vm.timeline.goTo(0);
            }
          }, 500);
        });




    }
  }

]);
