var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);

queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){
  $scope.formData = {};
  var queryBody = {};

  geolocation.getLocation().then(function(data){
    coords = {
      lat: data.coords.latitude,
      lng: data.coords.longitude
    };

    $scope.formData.longitude = parseFloat(coords.lng).toFixed(3);
    $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

    $rootScope.$on("clicked", function(){
        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    $scope.queryUsers = function(){
      queryBody = {
          longitude:    parseFloat($scope.formData.longitude),
          latitude:     parseFloat($scope.formData.latitude),
          distance:     parseFloat($scope.formData.distance),
          male:         $scope.formData.male,
          female:       $scope.formData.female,
          other:        $scope.formData.other,
          minAge:       $scope.formData.minage,
          maxAge:       $scope.formData.maxage,
          favlang:      $scope.formData.favlang,
          reqVerified:  $scope.formData.verified
      };

      $http.post('/query', queryBody)
        .success(function(queryResults){
          gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);
          $scope.queryCount = queryResults.length;

          $log.debug("Query Body: ");
          $log.debug(queryBody);
          $log.debug("Query Results: ");
          $log.debug(queryResults);

        })
        .error(function(queryResults){
          $log.debug('Error '+ queryResults);
        })
    }
  })
})
