(function() {
    'use strict';

    angular.module('cdmp.services', [])

    .factory('_', ['$window',
        function($window) {
            return $window._;
        }
    ])

    .factory('he', ['$window',
        function($window) {
            return $window.he;
        }
    ])

    .factory('bowser', ['$window',
        function($window) {
            return $window.bowser;
        }
    ])

    .factory('moment', ['$window',
        function($window) {
            return $window.moment;
        }
    ])

    .factory('parseUri', ['$window',
        function($window) {
            return $window.parseUri;
        }
    ])

    .factory('safeApply', ['$rootScope', function($rootScope) {
        return function(fn, $scope) {
            $scope = $scope || $rootScope;
            var phase = $scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn) {
                    $scope.$eval(fn);
                }
            } else {
                if (fn) {
                    $scope.$apply(fn);
                } else {
                    $scope.$apply();
                }
            }
        };
    }]);

}).call(this);
