'use strict';

angular.module('webui.directives.menuButton', []).
directive('ajMenuButton', function($document) {
  var template =
      '<button ng-click="open()">{{title}}</button>' +
      '<div ng-show="opened" ng-transclude></div>';
  return {
    scope: {'title': '@title'},
    restrict: 'AE',
    template: template,
    transclude: true,
    link: function(scope, element, attrs) {
      scope.opened = false;
      scope.open = function() {
        scope.opened = !scope.opened;
      };
      element.find('button').bind('blur', function() {
        scope.$apply(function() {
          scope.opened = false;
        })
      });

      scope.$on('globalCloseAll', function(event) {
        scope.opened = false;
      });
    }
  };
});
