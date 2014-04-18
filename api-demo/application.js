var app = angular.module("app", ["ngRoute", "nvd3ChartDirectives", "ui.bootstrap"]);

app.config (function($routeProvider){
    $routeProvider.when("/", {
        templateUrl: "templates/index.html",
        controller: "IndexController"
    }).when("/search", {
        templateUrl: "templates/search.html",
        controller: "SearchController"
    }).otherwise({
        redirectTo: "/"
    });
});

app.service("APIService", function($http, $q){
    return {
        get: function(resorce, params){
            return $http({
                method: "GET",
                url: "https://api.open-budget.org/v1/" + resorce,
                params: params
            })
        }
    };
});

app.filter("formatNumber", function() {
    return function(number) {
        return accounting.formatNumber(number);
    };
});

app.filter("formatMoney", function(){
    return function(number){
        return accounting.formatMoney(number, { symbol: "тис. грн", format: "%v %s" });
    }
});

app.controller ("IndexController", function($scope){

    $scope.data = [
        { key: "Полтавська", y: 20 },
        { key: "Дніпропетровська", y: 30 },
        { key: "Черкаська", y: 40 }
    ];

    $scope.xFunction = function(){
        return function(d){
            return d.key;
        };
    };

    $scope.yFunction = function(){
        return function(d){
            return d.y;
        };
    };

    $scope.radioModel = "1";
});

app.controller("SearchController", function($scope, APIService){

    APIService.get("areas.json", {}).success(function(data){
        $scope.areas = data;
    });

    $scope.$watch("query", function(){
        var lazyLoad = _.debounce(function(){
            APIService.get("expenses.json", { search: $scope.query }).success(function(data){
                $scope.results = data;
            });
        }, 300);
        if ($scope.query !== "") {
            lazyLoad();
        } else {
            delete $scope.results;
        }
    });

    $scope.areaName = function(area_id) {
        return _.find($scope.areas, function(area){
            return area.id === area_id;
        }).name;
    };
});