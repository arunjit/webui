'use strict';

angular.module('webui.directives.nav', []).
directive('ajNav', function() {
  return {
    restrict: 'A',
    scope: {'currentClassBind': '@'},
    controller: function($scope, $attrs) {
      var currentClass = $scope.currentClassBind || $attrs['currentClass'];
      this.getCurrentClass = function(value) {
        return currentClass;
      };
    }
  };
}).
directive('ajNavLink', function($rootScope, $location) {
  return {
    require: '^ajNav',
    restrict: 'A',
    link: function(scope, element, attrs, navCtrl) {
      var href = element.attr('href') || element.find('a').attr('href');
      href = href.replace(/^#!?/, '');
      var className = navCtrl.getCurrentClass() || 'current';
      $rootScope.$on('$locationChangeSuccess', function(event, current, last) {
        element.removeClass(className);
        if ($location.path() === href) {
          // TODO(arunjit): Use `$location.path()` or `current`?
          element.addClass(className);
        }
      });
    }
  };
});
