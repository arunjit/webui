'use strict';

angular.module('main').service('productService',
    function($q, $http, notificationService) {

      /**
       * Lists all products
       *
       * @return {!angular.$q.Promise} The list as a promise.
       */
      this.list = function() {
        var deferred = $q.defer();
        notificationService.show('Loading products')
        $http.get('data/products.json').success(function(data) {
          notificationService.hide();
          deferred.resolve(data);
        }).error(function() {
          notificationService.show(
              'Error getting products', {dismissible: true});
          deferred.reject('Error getting products');
        });
        return deferred.promise;
      }
    }
);
