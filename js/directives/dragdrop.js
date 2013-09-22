'use strict';

angular.module('webui.directives.dragdrop', []).
directive('ajDrag', function($parse) {
  var dragstart = 'dragstart';

  function setupDrag(element) {
    element.attr('draggable', 'true');
  }

  function handleDragStart(element) {
    return function(e) {
      element.addClass(dragstart);
      e.dataTransfer.effectAllowed = 'copy';
    };
  }

  function handleDragEnd(element) {
    return function(e) {
      element.removeClass(dragstart);
    };
  }

  // Directive:
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if ((attrs.ngDisabled && scope.$eval(attrs.ngDisabled)) ||
          element.hasClass('disabled')) {
        return;
      }
      var data = scope.$eval(attrs.ajDrag || attrs.ngModel);
      var dragFn = $parse(attrs.ajDragFn);

      setupDrag(element);

      // Start dragging
      element.bind('dragstart', function(e) {
        handleDragStart(element)(e);

        e.dataTransfer.setData('text/json', angular.toJson(data));
        scope.$apply(function() {
          $parse('$data').assign(scope, data);
          $parse('$event').assign(scope, e);
          dragFn && dragFn(scope);
        });
      });

      // Stop dragging
      element.bind('dragend', handleDragEnd(element));
    }
  };
}).directive('ajDrop', function($parse) {
  var dragover = 'dragover';
  var drop = 'drop';
  var classes = [dragover, drop].join(' ');

  function handleDragOver(element) {
    return function(e) {
      e.stopPropagation();
      e.preventDefault();
      element.removeClass(classes).addClass(dragover);
    };
  }

  function handleDragLeave(element) {
    return function(e) {
      element.removeClass(classes);
    };
  }

  function handleDrop(element) {
    return function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      element.removeClass(classes).addClass(drop);
    };
  }

  // Directive:
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if ((attrs.ngDisabled && scope.$eval(attrs.ngDisabled)) ||
          element.hasClass('disabled')) {
        return;
      }
      var dropModel = attrs.ajDrop || attrs.ngModel;
      var dropFn = $parse(attrs.ajDropFn);

      element.bind('dragover', handleDragOver(element));
      element.bind('dragleave', handleDragLeave(element));

      // Handle drop
      element.bind('drop', function(e) {
        handleDrop(element)(e);
        var data = angular.fromJson(e.dataTransfer.getData('text/json'));
        scope.$apply(function() {
          dropModel && $parse(dropModel).assign(scope, data);
          $parse('$data').assign(scope, data);
          $parse('$event').assign(scope, e);
          dropFn && dropFn(scope);
        });
        return false;
      });
    }
  };
});
