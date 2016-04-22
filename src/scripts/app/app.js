(function() {
    'use strict';

    angular.module('ms', ['ms.services', 'ms.controllers', 'ms.directives', 'ms.filters', /*'ngRoute',*/ 'ngSanitize', /*'ngCookies',*/ 'matchmedia-ng', 'duScroll', 'ngMask', /*'templates'*/])


    .run(['$rootScope',

        function($rootScope) {

            FastClick.attach(document.body);

        }
    ]);

}).call(this);
