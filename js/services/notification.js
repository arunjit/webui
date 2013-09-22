/**
 * Notification service and directive.
 *
 * This is currently meant for a single notification bar only. Multiple use of
 * the directive would show the same message in multiple places.
 */

'use strict';

angular.module('main').
constant('showNotification', Math.random().toString(36) + '-showNotification').
constant('hideNotification', Math.random().toString(36) + '-hideNotification').
service('notificationService', function(
    $rootScope, showNotification, hideNotification) {

  /** @typedef {{timeout: number, error: boolean, dismissable: boolean}} */
  var NotificationOptions;

  /*
   * Default notification options.
   *
   *   timeout: timeout to hide notification(s) (seconds).
   *   error: Show notification as an error.
   *   dismissable: Can be dismissed by a user.
   *
   * @type {NotificationOptions}
   */
  var defaultOptions = {
    timeout: 0,
    error: false,
    dismissable: false
  };

  /**
   * Shows the notification(s).
   *
   * Options:
   *   timeout: timeout to hide notification(s) (seconds).
   *   error: Show notification as an error.
   *   dismissable: Can be dismissed by a user.
   *
   * @param {string} message The message to show.
   * @param {NotificationOptions} options Notification options.
   */
  this.show = function(message, options) {
    options = angular.extend({}, defaultOptions, options);
    $rootScope.$emit(showNotification, message, options);
  };

  /** Hides the notification(s). */
  this.hide = function() {
    $rootScope.$emit(hideNotification);
  };
}).
directive('notificationBar', function(
    $rootScope, $timeout, showNotification, hideNotification) {
  var template =
      '<div class="notification-bar" ng-hide="hide" ng-init="hide=true">' +
      '  <div class="content" ng-class="{error:error}">' +
      '    <div class="message" ng-bind="message"></div>' +
      '    <div class="close" ng-show="dismissable" ng-click="close()"></div>' +
      '  </div>' +
      '</div>';

  var lastTimeout = null;
  var cancelTimeout = function() {
    if (lastTimeout) {
      $timeout.cancel(lastTimeout);
      lastTimeout = null;
    }
  };

  var hide = function(scope) {
    return function() {
      scope.message = '';
      scope.hide = true;
      scope.error = false;
      scope.dismissable = false;
      cancelTimeout();
    };
  };

  return {
    scope: {},
    restrict: 'AE',
    template: template,
    replace: true,
    // transclude: true,
    link: function(scope, element, attrs) {
      $rootScope.$on(showNotification, function(event, message, options) {
        scope.message = message;
        scope.hide = false;
        scope.error = !!options.error;
        scope.dismissable = !!options.dismissable;
        cancelTimeout();
        if (options.timeout) {
          lastTimeout = $timeout(hide(scope), options.timeout * 1000);
        }
      });
      $rootScope.$on(hideNotification, hide(scope));
      $rootScope.$on('$routeChangeSuccess', hide(scope));
      scope.close = hide(scope);
    }
  };
});
