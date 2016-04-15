(function() {
    'use strict';

    angular.module('cdmp.filters', ['ngSanitize'])

    // Return trusted html
    .filter('htrust', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }
    ])

    // Return trusted url
    .filter('utrust', ['$sce',
        function($sce) {
            return function(url) {
                return $sce.trustAsResourceUrl(url);
            };
        }
    ])

    .filter('range', function() {
        return function(input, total) {
            return _.range(0, parseInt(total, 10));
        };
    })

    .filter('capitalize', function() {
        return function(input) {
            return _.capitalize(input.toLowerCase());
        };
    })

    ;

}).call(this);
