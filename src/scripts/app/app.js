(function() {
    'use strict';

    angular.module('cdmp', ['cdmp.services', 'cdmp.controllers', 'cdmp.directives', 'cdmp.filters', /*'ngRoute',*/ 'ngSanitize', /*'ngCookies',*/ 'matchmedia-ng', 'duScroll', 'ngMask', 'rcMailgun', 'templates'])

    .config(['rcMailgunProvider', 'AnalyticsProvider',
        function(rcMailgunProvider, AnalyticsProvider) {

            rcMailgunProvider.configure({
                api_key: 'pubkey-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            });

            // Setup Analytics
            var isProd = /PROD.com$/i.test(window.location.host);

            if (isProd) {

                AnalyticsProvider.setAccount([{
                    id: 'UA-62459546-1',
                    name: 'default'
                }, {
                    id: 'UA-62459546-2',
                    name: 'rollup'
                }, ]);

                AnalyticsProvider.setCookieConfig({
                    'cookieDomain': 'auto'
                });

            } else {

                AnalyticsProvider.setAccount([{
                    id: 'UA-62459546-3',
                    name: 'default'
                }, {
                    id: 'UA-62459546-4',
                    name: 'rollup'
                }, ]);

                AnalyticsProvider.setCookieConfig({
                    'cookieDomain': 'none'
                });

                // Turn on to load debug version of analytics (prints a lot of stuff to the console)
                // AnalyticsProvider.setDebug(true);

            }

            // set to true when using angular routing (make sure to specify the change event name)
            AnalyticsProvider.trackPagesAutomatically(false);

            // use analytics.js vs ga.js
            AnalyticsProvider.useAnalytics(true);

            // set to true when using angular routing
            AnalyticsProvider.ignoreFirstPageLoad(false);

            // set to true when using angular routing
            AnalyticsProvider.usePageViewForPageField(false);

        }
    ])

    .run(['$rootScope',

        function($rootScope) {

            FastClick.attach(document.body);

        }
    ]);

}).call(this);
