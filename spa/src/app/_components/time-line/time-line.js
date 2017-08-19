

app.directive('history', [

  /** @ngInject */
  function history() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/_components/time-line/time-line.html',
      scope: {
        history: '=',
        mainAction: '='
      },
      controller: TimeLineController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TimeLineController(APIConfig, $scope, $timeout) {
      var vm = this;
      let dateFields = {};
      vm.options = {
        debug: false,
        timenav_position: 'top',
        language: 'es'
      };

      var projectDates = {
        'created_at': {
          'name': 'Proyecto fue creado',
          'image': 'client',
        },
        'accepted_at': {
          'name': 'Proyecto fue aceptado',
          'image': 'producer',
        },
        'qualified_at': {
          'name': 'Proyecto cerrado',
          'image': 'client',
        },

        'advance_report_at': {
          'name': 'Avance reportado',
          'image': 'producer',
        },
        'ejecution_report_at': {
          'name': 'Proyecto  ejecutado',
          'image': 'producer',
        }
      };
      var actionDates = {
        'created_at': {
          'name': 'Acción fue creada',
          'image': 'client',
        },
        'accepted_at': {
          'name': 'Acción fue aceptada',
          'image': 'producer',
        },
        'qualified_at': {
          'name': 'Acción cerrada',
          'image': 'client',
        },

        'advance_report_at': {
          'name': 'Avance reportado',
          'image': 'producer',
        },
        'ejecution_report_at': {
          'name': 'Acción  ejecutada',
          'image': 'producer',
        }
      };

      let getStringCondition = function (action, date) {
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
            if (moment(action.advance_report_at).isAfter(moment(action.advance_report_at)))
              period = 'fuera de tiempo';
            text = `<p class="${action.color}-status-text" > Se reportó avance de ${action.reports[0].progress}, ${period} </p>`
            break;
          case 'ejecution_report_at':
            let period1 = 'en tiempo'
            if (moment(action.ejecution_report_at).isAfter(moment(action.accomplish_at)))
              period1 = 'fuera de tiempo';
            text = `<p class="${action.color}-status-text" > El realizador terminó la acción  ${period1}  </p>`
            break;
          default:

        }
        return text;
      }

      var getHeaderColors = function (timeline) {
        angular.forEach(timeline.config.events, function (event) {
          if (event.action.id == vm.mainAction) {
            $("#" + event.unique_id + "-marker").children().addClass("t4-timeline-primary")
          } else {
            $("#" + event.unique_id + "-marker").children().addClass("t4-timeline-third")
          }
        })
      }

      var transformActions = function (results) {

        let newArray = [];
        let data = {
          events: []
        };

        angular.forEach(results, function (action) {

          if (action.parent_action)
            dateFields = actionDates;
          else
            dateFields = projectDates;

          angular.forEach(dateFields, function (key, value) {
            if (action[value]) {
              let event = {

                'media': {
                  'url': action[key.image]['photo']
                },
                'start_date': {
                  'year': moment(action[value]).format('Y'),
                  'month': moment(action[value]).format('M'),
                  'day': moment(action[value]).format('D')
                },
                'text': {
                  'headline': "<span class='hidee'>" + action.name + "</span>" + "<br class='hidee'><span>" + key.name + "</span>",
                  'text': getStringCondition(action, value)
                },
                'action': action


              }
              data.events.push(event);
            }

          })
        })

        $timeout(function () {
          if (data.events.length > 0) {
            vm.timeline.setData(data);
            vm.timeline.setOptions(vm.options);
            getHeaderColors(vm.timeline);
            vm.timeline.goTo(0);
          }
        }, 200);

      }

      var time = $scope.$watchCollection('vm.history', function () {
        if (vm.history) {
          console.log(vm.history)
          vm.history = transformActions(vm.history);
        }
      });

    }
  }

]);
