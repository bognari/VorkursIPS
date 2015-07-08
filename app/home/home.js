var home = angular.module('IPSVorkurs.home', ['ngRoute', 'IPSVorkurs']);

home.controller('homeCtrl', ['$scope', 'config', function($scope, config) {
  $scope.semester = config.SEMESTER;
  $scope.pdf = config.PDF_LINK;
}]);

home.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl',
    title: ' '
  });
}]);

