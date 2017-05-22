

app.directive('timeLine', ['URLTemplates',

  /** @ngInject */
  function timeLine(URLTemplates) {
    var directive = {
      restrict: 'E',
      templateUrl: URLTemplates + 'app/_components/time-line/time-line.html',
      scope: {
          timeLine: '='
      },
      controller: TimeLineController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TimeLineController(APIConfig , $scope ) {
      var vm = this;

      var dateFields = {
          'accomplish_at':'Fecha de ejecución',
          'report_at':'Fecha de reporte',
          'begin_at':'Fecha de inicio',
        };

    	var transformActions = function(results){
    		//private functions

    		function custom_sort(a, b) {
    		    return new Date(a.timeline).getTime() - new Date(b.timeline).getTime();
    		}

    		function arrayObjectIndexOf(myArray, searchTerm, property) {
    		    for(var i = 0, len = myArray.length; i < len; i++) {
    		        if (myArray[i][property] === searchTerm) return i;
    		    }
    		    return -1;
    		}

    		function UniqueArraybyId(collection, keyname) {
                  var output = [],
                      keys = [], d  =[];

                  angular.forEach(collection, function(item) {
                      var key = item[keyname];
                      if(keys.indexOf(key) === -1) {
                          keys.push(key);
                          output.push(item);
                      }
    									else{
    										var pos = arrayObjectIndexOf(output,key,'timeline');
    										output[pos].actions.push(item.actions[0])
    									}
                  });
    							angular.forEach(d, function(item){
    								var key = item[keyname];
    							})
            return output;
    		}


    		var newArray = [];
    		angular.forEach(results, function (result) {
    			angular.forEach(dateFields, function(key, value){
    				var obj = {}
    				obj.timeline = result[value];
    				obj.actions = [];
    				result.timeline_text = key
    				obj.actions.push(angular.copy(result))
    				newArray.push(obj)

    			})
    		})

    		newArray = newArray.sort(custom_sort);
    		var newArray = UniqueArraybyId(newArray,'timeline');


    		//asign photo
    		newArray.forEach(function(item){
    			angular.forEach(item.actions, function(item2){
    				item2.producer.photo =  APIConfig.baseUrl+ angular.copy(item2.producer.photo);
    			})
    		})
    		//end of asignment

    		return newArray;
    	}

      var time = $scope.$watch( 'vm.timeLine', function () {
        if(vm.timeLine ){
          console.log("una", vm.timeLine);
            vm.timeLine = transformActions(vm.timeLine)
            $.getScript("/assets/metronics/global/plugins/horizontal-timeline/horizontal-timeline.js", function(){});

            time();
        }

      });

    }
  }

]);
