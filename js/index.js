angular.module('index', [
    'webui.directives.nav'
]).
config(function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'views/home.html'}).
      when('/controls', {templateUrl: 'views/controls.html'});
});
