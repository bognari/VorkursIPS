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
        //console.log(angular.toJson(ngFabForm));

        ngFabForm.config.validationsTemplate = 'german-validation-msgs.html';

        $scope.semester = config.SEMESTER;
        $scope.pdf = config.PDF_LINK;

        //$scope.mathgroups = config.MATH_GROUPS;
        //$scope.bothCourses = config.BOTH_COURSES;
        //$scope.defaultGroup = config.DEFAULT_GROUP;
        $scope.courses = config.COURSES;

        $scope.formData = {lastname: "", firstname: "", email: "", math: false, cs: false, laptop: false, proglang: "", os: "", school: ""};

        $scope.check = function() {
            if ($scope.input.course == 'math+cs') {
                //$scope.formData.group = $scope.bothCourses.value;
                $scope.formData.math = true;
                $scope.formData.cs = true;
            } else if ($scope.input.course == 'cs') {
                //$scope.formData.group = "";
                $scope.formData.math = false;
                $scope.formData.cs = true;
            } else if ($scope.input.course == 'math') {
                //if ($scope.formData.group == '') {
                //    $scope.formData.group = $scope.defaultGroup.value;
                //}
                $scope.formData.math = true;
                $scope.formData.cs = false;
            }
        };

        $scope.submit = function () {
            console.log(angular.toJson($scope.formData));
            $http.post(config.SUBMIT, $scope.formData).success(function() {
                alert('Sie wurden erfolgreich zum Vorkurs eingetragen, weiteres entnehmen Sie bitte der Email.');
            }).error(function() {
                alert('Es ist ein Fehler aufgetreten, prüfen Sie bitte Ihre eingaben.');
            })
        };
        $scope.resetForm = function () {
            $scope.$broadcast('NG_FAB_FORM_RESET_ALL');
        };
        $scope.defaultFormOptions = ngFabForm.config;

        //console.log(angular.toJson($scope.defaultFormOptions, true));

        $scope.customFormOptions = angular.copy(ngFabForm.config);

        $scope.destroy = function () {
            $scope.exampleUrl = null;
        };
        $scope.setExample = function (example) {
            $scope.exampleUrl = 'demos/' + example + '.html';
        };
    }]);