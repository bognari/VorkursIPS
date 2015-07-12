angular.module('IPSVorkurs.anmeldung', ['ngRoute', 'IPSVorkurs', 'ngFabForm', 'ngAnimate', 'ngMessages'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/anmeldung', {
            templateUrl: 'anmeldung/anmeldung.html',
            controller: 'anmeldungCtrl',
            title: ' - Anmeldung'
        });
    }])

    .run(function ($rootScope, $location, $anchorScroll) {
        $rootScope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };
    })

    .controller('anmeldungCtrl', ['$anchorScroll', '$scope', '$http','config', 'ngFabForm', function ($anchorScroll, $scope, $http, config, ngFabForm) {

        ngFabForm.config.validationsTemplate = 'german-validation-msgs.html';

        $scope.semester = config.SEMESTER;
        $scope.pdf = config.PDF_LINK;
        $scope.courses = config.COURSES;
        $scope.status = '';
        $scope.input = {};

        $scope.formData = {lastname: "", firstname: "", email: "", math: false, cs: false, laptop: false, proglang: "", os: "", school: ""};

        $scope.check = function() {
            if ($scope.input.course == 'math+cs') {
                $scope.formData.math = true;
                $scope.formData.cs = true;
            } else if ($scope.input.course == 'cs') {
                $scope.formData.math = false;
                $scope.formData.cs = true;
            } else if ($scope.input.course == 'math') {
                $scope.formData.math = true;
                $scope.formData.cs = false;
            }
        };

        $scope.submit = function () {
            $http.post(config.SUBMIT, $scope.formData).success(function(data) {
                $scope.response = angular.fromJson(data);
                $scope.status = 'success';
            }).error(function(data) {
                $scope.response = angular.fromJson(data);
                $scope.status = 'error';
            })
        };
        $scope.resetForm = function () {
            $scope.$broadcast('NG_FAB_FORM_RESET_ALL');
        };
        $scope.defaultFormOptions = ngFabForm.config;

        $scope.customFormOptions = angular.copy(ngFabForm.config);
    }]);