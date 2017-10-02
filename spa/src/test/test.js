describe('HomeCtrl', function () {
  beforeEach(module('myApp'));

  it('initialises scope',
    inject(function ($controller, $rootScope) {
      var scope = $rootScope.$new();
      var ctrl = $controller('LoginController', {
        $scope: scope
      });
      console.log(scope)
      expect(scope.hello).toBe("kkkk")
    }));

});