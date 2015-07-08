var IPSVorkurs = angular.module('IPSVorkurs', [
    'ngRoute',
    'IPSVorkurs.home',
    'IPSVorkurs.anmeldung'
]);

var courses = [{name: 'Vorkurs der Mathematik', value: 'math'}, {name: 'Vorkurs der Informatik', value: 'cs'}, {name: 'Vorkurs der Mathematik und Informatik', value: 'math+cs'}];

IPSVorkurs.constant('config', {
    'SEMESTER' : '2015/16',
    'PDF_LINK' : 'http://www.ips.tu-braunschweig.de/struckmann/vorkurs15w/einladung.pdf',
    'COURSES' : courses,
    'SUBMIT' : '../vorkursIPSBackend/submit.php'
});

IPSVorkurs.run(['$location', '$rootScope', 'config', function($location, $rootScope, config) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        //console.log(angular.toJson(current));
        $rootScope.title = ' ' + config.SEMESTER + current.$$route.title;
    });
}]);

IPSVorkurs.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .otherwise({redirectTo: '/home'});
}]);
