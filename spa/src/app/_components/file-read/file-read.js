app.directive("fileread", [function () {
    return {
        restrict: 'E',
        templateUrl: 'app/_components/file-read/fileread.html',
        scope: {
            fileread: "="
        },
        controller: fileReadController,

        link: function (scope, element, attributes) {
            // element.bind("change", function (changeEvent) {
            //     var reader = new FileReader();
            //     reader.onload = function (loadEvent) {
            //         scope.$apply(function () {
            //             scope.fileread = loadEvent.target.result;
            //         });
            //     }
            //     reader.readAsDataURL(changeEvent.target.files[0]);
            // });
        }
    }
    function fileReadController($scope){
      var image = document.querySelector( '#image-profile' );
      image.crossOrigin = "Anonymous";
      let canvas = document.querySelector( '#canvas-profile' );
      image.onload = function () {
        var ctx = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(image, 0, 0);
        $scope.fileread = canvas.toDataURL()

        console.log($scope.fileread);
      }

    }

}]);
