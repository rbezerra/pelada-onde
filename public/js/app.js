var app = angular.module('meanMapApp', ['ngRoute', 'addCtrl', 'queryCtrl', 'gservice', 'geolocation']);

app.config(function($routeProvider){
  $routeProvider
    .when('/join', {
      controller: 'addCtrl',
      templateUrl: 'partials/addForm.html'
    })
    .when('/find', {
      controller: 'queryCtrl',
      templateUrl: 'partials/queryForm.html'
    })
    .otherwise({redirectTo: '/join'});
})
