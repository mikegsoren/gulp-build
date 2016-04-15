(function() {

    /**
     * @ngdoc provider
     * @name ng.provider:rcMailgunProvider
     *
     * @description
     * configure the mailgun api and directive
     * adding to the scope so the attempt flag can be referenced in markup.
     *
     */
    var rcMailgunProvider = {
        'rcMailgun': function() {

            var configuredOptions = {};

            this.configure = function(options) {
                configuredOptions = options;
            };

            this.$get = function() {
                return {
                    getOptions: function() {
                        return configuredOptions;
                    }
                };
            };
        }
    };

    /**
     * @ngdoc directive
     * @name ng.directive:rcMailgunValid
     *
     * @description
     * Used to track submit attempts on forms. It mimics the ngFormController by
     * adding to the scope so the attempt flag can be referenced in markup.
     *
     */
    var rcMailgunValidDirective = {
        'rcMailgunValid': ['rcMailgun', '$http', '$timeout', '$q', function(rcMailgun, $http, $timeout, $q) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {

                    options = rcMailgun.getOptions();

                    options = options || {};

                    if (!options.api_key) {
                        throw new Error('missing api_key!');
                    }

                    var successWrapper = function(data, status, headers, config) {

                        ctrl.$setValidity('rcMailgunInProgress', true);
                        ctrl.$setValidity('rcMailgunFinished', true);
                        ctrl.$setValidity('rcMailgunEmailValid', (data && data.is_valid));

                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    };

                    var errorWrapper = function(data, status, headers, config) {

                        ctrl.$setValidity('rcMailgunInProgress', true);
                        ctrl.$setValidity('rcMailgunFinished', true);
                        ctrl.$setValidity('rcMailgunEmailValid', false);

                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    };

                    var inProgressWrapper = function() {

                        // clear when checking
                        ctrl.$setValidity('rcMailgunEmailValid', true);
                        ctrl.$setValidity('rcMailgunInProgress', false);

                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    };

                    var clearWhenBlankValidator = function(value) {
                        if (!value) {
                            ctrl.$setValidity('rcMailgunInProgress', true);
                            ctrl.$setValidity('rcMailgunFinished', true);
                            ctrl.$setValidity('rcMailgunEmailValid', true);
                        }

                        return value;
                    };

                    var deferredAbort;

                    var runValidator = function(value) {

                        if (!value) {
                            return;
                        }

                        if (deferredAbort) {
                            deferredAbort.resolve();
                        }

                        deferredAbort = $q.defer();

                        inProgressWrapper();

                        httpPromise = $http
                            .jsonp('https://api.mailgun.net/v2/address/validate?callback=JSON_CALLBACK', {
                                params: {
                                    address: value.toLowerCase(),
                                    api_key: options.api_key
                                },
                                timeout: deferredAbort.promise
                            })
                            .success(successWrapper)
                            .error(errorWrapper);
                    };

                    ctrl.$formatters.push(clearWhenBlankValidator);
                    ctrl.$parsers.unshift(clearWhenBlankValidator);

                    if (!scope.$eval('loggedIn')) {
                        runValidator(ctrl.$viewValue);
                    }

                    scope.$watch(attrs.ngModel, function(newValue, oldValue) {

                        if (!newValue || newValue === oldValue) {
                            return;
                        }

                        if (!scope.$eval('loggedIn')) {
                            runValidator(newValue);
                        }

                    });
                }
            };
        }]
    };

    var rcMailgunModule = angular.module('rcMailgun', []);

    if (rcMailgunProvider) {
        rcMailgunModule.provider(rcMailgunProvider);
    }
    if (rcMailgunValidDirective) {
        rcMailgunModule.directive(rcMailgunValidDirective);
    }

})();
