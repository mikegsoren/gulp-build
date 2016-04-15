(function() {
    'use strict';

    angular.module('cdmp.directives', [])

    .directive('trackEvent', ['$window', 'Analytics',

        function($window, Analytics) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ctrl) {

                    var eventType = attrs.trackEventType || 'click';

                    element.on(eventType + '.ga', function(event) {

                        // Array is ordered as such:
                        // [category, action, label, value]
                        var trackArray;

                        try {
                            trackArray = scope.$eval(attrs.trackEvent);
                        } catch (exception) {
                            // something messed up
                            trackArray = null;
                        }

                        if (trackArray) {
                            Analytics.trackEvent.apply(this, trackArray);
                        }
                    });

                    scope.$on('$destroy', function() {
                        element.off('.ga');
                    });

                }
            };
        }
    ])

    .directive('showFocus', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    var timeout;

                    scope.$watch(attrs.showFocus, function(newValue, oldValue) {

                        if (newValue) {

                            $timeout.cancel(timeout);

                            // something is bluring it, setting timeout to 150
                            timeout = $timeout(function() {
                                element.focus();
                            }, 150);
                        }

                    });
                }
            };
        }
    ])

    .directive('mobiscroll', ['$rootScope', '$window', '$timeout', 'moment',
        function($rootScope, $window, $timeout, moment) {
            return {
                restrict: 'A',
                require: 'ngModel',
                // scope: true,
                link: function(scope, element, attrs, ctrl) {

                    scope.subtract = function(number, period) {
                        return moment().subtract(number, period).toDate();
                    };

                    scope.add = function(number, period) {
                        return moment().add(number, period).toDate();
                    };

                    scope.today = function() {
                        return new Date();
                    };

                    scope.yesterday = function() {
                        return moment().subtract(1, 'days').toDate();
                    };

                    scope.tomorrow = function() {
                        return moment().add(1, 'days').toDate();
                    };

                    var maxDate = scope.$eval(attrs.maxDate) || null;
                    var minDate = scope.$eval(attrs.minDate) || null;

                    var watcher;

                    element
                        .mobiscroll()
                        .calendar({
                            animate: false,
                            buttons: [],
                            closeOnSelect: false,
                            context: '.injector--mobiscroll',
                            focusOnClose: false,
                            maxDate: maxDate,
                            minDate: minDate,
                            scrollLock: false,
                            tap: false,
                            theme: 'mobiscroll',
                            lang: $rootScope.lang,
                            onBeforeShow: function(inst) {

                                if (scope.mq.sm) {
                                    inst.settings.display = 'bottom';
                                } else {
                                    inst.settings.display = 'modal';
                                }

                                if (moment(ctrl.$viewValue, $rootScope.dateFormat).isValid()) {
                                    inst.setDate(moment(ctrl.$viewValue, $rootScope.dateFormat).toDate());
                                }

                                $('.injector--mobiscroll').addClass('open');

                                angular.element($window)
                                    .on('resize.mobiscroll', function(e) {
                                        element.mobiscroll('position', true);
                                    })
                                    .on('orientationchange.mobiscroll', function(e) {
                                        element.mobiscroll('cancel');
                                    });

                            },
                            onShow: function(html, valueText, inst) {

                                // Remove the selected state from the button if there is no date value yet

                                if (!inst.getValues()[0]) {
                                    $('.dw-cal-day.dw-sel', html).removeClass('dw-sel');
                                }

                            },
                            onClose: function(valueText, btn, inst) {

                                $('.injector--mobiscroll').removeClass('open');

                                angular.element($window).off('.mobiscroll');

                                element.trigger('blur');

                            }

                        });

                    element.siblings('.icon, .blocker').on('click.mobiscroll', function(e) {
                        if (!element.is(':disabled')) {
                            element.mobiscroll('show');
                        }
                    });

                    // Only way i could get mobiscroll to do a timeout delay.

                    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }

                        if (element.mobiscroll('isVisible')) {

                            $timeout(function() {
                                element.mobiscroll('select');
                            }, 0);

                        }
                    });

                    scope.$watch('mq.sm', function(newValue, oldValue) {
                        element.mobiscroll('cancel');
                    });

                    scope.$on('$destroy', function(e) {
                        element.mobiscroll('destroy');
                        element.siblings('.icon, .blocker').off('.mobiscroll');
                    });
                }
            };
        }
    ])

    .directive('uppercase', ['_',
        function(_) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {

                    // View -> Model
                    ctrl.$parsers.push(function(data) {

                        if (!data) {
                            return;
                        }

                        return data.toUpperCase();

                    });

                    // Model -> View
                    ctrl.$formatters.push(function(data) {

                        if (!data) {
                            return;
                        }

                        return data.toUpperCase();

                    });
                }
            };
        }
    ])

    .directive('lowercase', ['_',
        function(_) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {

                    // View -> Model
                    ctrl.$parsers.push(function(data) {

                        if (!data) {
                            return;
                        }

                        return data.toUpperCase();

                    });

                    // Model -> View
                    ctrl.$formatters.push(function(data) {

                        if (!data) {
                            return;
                        }

                        return data.toLowerCase();

                    });
                }
            };
        }
    ])

    .directive('capitalize', ['_',
        function(_) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {

                    // View -> Model
                    ctrl.$parsers.push(function(data) {

                        if (!data) {
                            return;
                        }

                        return data.toUpperCase();

                    });

                    // Model -> View
                    ctrl.$formatters.push(function(data) {

                        if (!data) {
                            return;
                        }

                        return _.map(data.split(' '), function(val) {
                            return _.capitalize(val.toLowerCase());
                        }).join(' ');

                    });
                }
            };
        }
    ])

    .directive('equals', [
        function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {

                    scope.$watchCollection('[' + attrs.ngModel + ',' + attrs.equals + ']', function(newValue, oldValue) {
                        ctrl.$setValidity('equals', newValue[0] && newValue[1] && newValue[0] === newValue[1]);
                    });
                }
            };
        }
    ])

    .directive('initModel', ['safeApply',
        function(safeApply) {
            return {
                priority: 450,
                restrict: 'A',
                require: 'ngModel',
                compile: function() {
                    return {
                        pre: function(scope, element, attrs, ctrl) {

                            if (attrs.initModel) {
                                scope.$eval(attrs.ngModel + ' = ' + attrs.initModel);
                            } else {
                                scope.$eval(attrs.ngModel + ' = undefined');
                            }

                        },
                        post: function(scope, element, attrs, ctrl) {

                            // if (attrs.initModel) {

                            //     safeApply(function() {
                            //         ctrl.$setViewValue(scope.$eval(attrs.initModel));
                            //         ctrl.$render();
                            //     }, scope);

                            // }

                        }
                    };
                }
            };
        }
    ])

    .directive('disableWhen', ['safeApply', '$timeout',
        function(safeApply, $timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    scope.$watch(function() {

                        return scope.$eval(attrs.disableWhen);

                    }, function(newValue, oldValue) {

                        if (newValue === true) {

                            element.on('focus.disableWhen', 'input, button, select', function(e) {

                                if (scope.$eval(attrs.disableWhen)) {
                                    $(e.currentTarget).blur();
                                }

                            });

                            element.on('keypress.disableWhen', 'input, button, select', function(e) {

                                if (scope.$eval(attrs.disableWhen)) {
                                    e.preventDefault();
                                }

                            });

                        } else {

                            element.off('.disableWhen');

                        }

                    });
                }
            };
        }
    ])

    .directive('resetWhen', ['safeApply', '$timeout',
        function(safeApply, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {

                    scope.$watch(function() {

                        return scope.$eval(attrs.resetWhen);

                    }, function(newValue, oldValue) {

                        // Needed to add an initialized variable to the scope
                        // The controller sometimes sets the data in the user is logged in

                        if (newValue === true) {

                            if (scope.$eval('initialized')) {

                                $timeout(function() {
                                    if (attrs.resetTo) {
                                        scope.$eval(attrs.ngModel + ' = ' + attrs.resetTo);
                                    } else {
                                        scope.$eval(attrs.ngModel + ' = undefined');
                                    }
                                });
                            }
                        }
                    });

                }
            };
        }
    ])

    // All global stuff
    .directive('primeDirective', ['$rootScope', '$window', '$document', '$timeout', '$interval', 'safeApply', 'bowser',
        function($rootScope, $window, $document, $timeout, $interval, safeApply, bowser) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    // Keyboard fix

                    var interval;
                    var oldHeight;
                    var scrollTop;

                    function opened() {
                        // console.log('opened');

                        $interval.cancel(interval);

                        oldHeight = window.innerHeight;

                        interval = $interval(intervalHandler, 500);

                        $document.find('html').addClass('keyboard-open');

                        // scrollTop = angular.element($window).scrollTop();

                    }

                    function closed() {
                        // console.log('closed');

                        $interval.cancel(interval);

                        oldHeight = 0;

                        $document.find('html').removeClass('keyboard-open');

                        // angular.element($window).scrollTop(scrollTop);

                    }

                    function intervalHandler() {
                        // console.log('intervalHandler');

                        if (oldHeight === 0) {
                            return;
                        }

                        var newHeight = window.innerHeight;
                        var diff = Math.abs(oldHeight - newHeight);
                        var perc = Math.round((diff / oldHeight) * 100);

                        if (newHeight > oldHeight) {
                            closed();
                        } else {
                            oldHeight = newHeight;
                        }
                    }

                    element.on('click.keyboardFix focus.keyboardFix', 'input:not([type="checkbox"]):not([type="radio"])', function(e) {
                        if (scope.mq.sm) {
                            opened();
                        }
                    });

                    element.on('blur.keyboardFix', 'input:not([type="checkbox"]):not([type="radio"])', function(e) {
                        if (scope.mq.sm) {
                            closed();
                        }
                    });

                    angular.element($window).on('orientationchange.keyboardFix', function(e) {
                        if (scope.mq.sm) {
                            angular.element(document.activeElement).blur();
                        }
                    });

                    scope.$watch('mq.sm', function(newValue, oldValue) {
                        if (newValue === false && newValue !== oldValue) {
                            closed();
                        }
                    });

                    // Fixed position scroll fix

                    var windowScrollLeft = angular.element($window).scrollLeft();

                    angular.element('.scroll-fix').scrollLeft(windowScrollLeft);

                    angular.element($window).on('scroll.scrollFix', function(e) {

                        var scrollLeft = angular.element(this).scrollLeft();

                        if (scrollLeft !== windowScrollLeft) {

                            angular.element('.scroll-fix').scrollLeft(scrollLeft);

                            windowScrollLeft = scrollLeft;
                        }

                    });

                    scope.$on('$destroy', function() {
                        closed();
                        element.off('.keyboardFix');
                        angular.element($window).off('.keyboardFix, .scrollFix');
                    });

                    // IE8 tab fix

                    if (bowser.msie === true && parseInt(bowser.version, 10) === 8) {

                        element.on('keydown.ie8TabFix', 'input, textarea, select, button', function(e) {
                            if (e.which === 9) {
                                e.preventDefault();
                            }
                        });

                        scope.$on('$destroy', function() {
                            element.off('keydown.ie8TabFix');
                        });

                    }

                }
            };
        }
    ])

    .directive('toggleParentClass', ['$document',
        function($document) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    element.on('click.toggleParentClass', function(e) {
                        element.parent().toggleClass(attrs.toggleParentClass);
                    });

                    scope.$on('$destroy', function(e) {
                        element.off('.toggleParentClass');
                    });

                }
            };
        }
    ])

    .directive('toggleClass', ['$document',
        function($document) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    element.on('click.toggleClass', function(e) {
                        element.toggleClass(attrs.toggleClass);
                    });

                    scope.$on('$destroy', function(e) {
                        element.off('.toggleClass');
                    });

                }
            };
        }
    ])

    .directive('accordion', ['$rootScope', '$parse', '_',
        function($rootScope, $parse, _) {
            return {
                restrict: 'A',
                scope: true,
                link: function(scope, element, attrs) {

                    var uniqueId = _.uniqueId();

                    var query = _.contains(scope.mq, attrs.accordionQuery) ? attrs.accordionQuery : false;

                    // hacky or clever, you decide.
                    var initialOpen = scope.open = element.hasClass('open');

                    var autoClose = scope.$eval(attrs.accordianAutoclose) ? true : false;

                    element.on('click.accordion', '.accordion__header', function(e) {
                        scope.open = !scope.open;
                        scope.$digest();

                        if (autoClose && scope.open && !scope.mq.sm) {
                            $rootScope.$emit('accordion:opened', {
                                uniqueId: uniqueId
                            });
                        }
                    });

                    if (query) {

                        scope.$watchCollection('[open, mq.' + query + ']', function(newValue, oldValue) {

                            if (newValue[0] === true && newValue[1] === true) {
                                element.addClass('open');
                            } else {
                                element.removeClass('open');
                            }

                        });

                    } else {

                        scope.$watch('open', function(newValue, oldValue) {

                            if (typeof newValue === 'undefined') {
                                return;
                            }

                            if (newValue === true) {
                                element.addClass('open');
                            } else {
                                element.removeClass('open');
                            }
                        });
                    }

                    // // Incase you open them all in sm, and resize to lg
                    // scope.$watch('mq.lg', function(newValue, oldValue) {
                    //     if (newValue === true) {
                    //         scope.open = initialOpen;
                    //     }
                    // });

                    // Reset on breakpoint change
                    scope.$watch('mq', function(newValue, oldValue) {

                        if (newValue === oldValue) {
                            return;
                        }

                        scope.open = initialOpen;

                    }, true);

                    var openListener;

                    if (autoClose) {
                        openListener = $rootScope.$on('accordion:opened', function(event, data) {
                            if (data.uniqueId !== uniqueId && !scope.mq.sm) {
                                scope.open = false;
                                scope.$digest();
                            }
                        });
                    } else {
                        openListener = _.noop;
                    }

                    scope.$on('$destroy', function() {
                        openListener();
                        element.off('.accordion');
                    });
                }
            };
        }
    ])

    .directive('input', ['$rootScope', '$timeout', '_',
        function($rootScope, $timeout, _) {
            return {
                restrict: 'E',
                link: function(scope, element, attrs) {

                    element.on('keyup', function(e) {
                        if (e.which === 13) {
                            element.blur();
                        }
                    });
                }
            };
        }
    ])

    .directive('setType', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    if (attrs.hasOwnProperty('placeholder')) {
                        // type is set in placeholder directive
                        return;
                    }

                    try {

                        element.attr('type', attrs.setType);

                    } catch (e) {

                        if (attrs.setType === 'password') {

                            element.addClass('font--password');

                            // disable cut/copy/paste

                            element.on('cut copy paste', function(e) {
                                e.preventDefault();
                            });

                        }

                    } finally {

                    }

                }
            };
        }
    ])

    .directive('placeholder', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ctrl) {

                    // Allows us to use 'text' for those browsers that don't allow changing type
                    // But change type for those that support it, IE9
                    var originalType = attrs.setType || attrs.type;

                    // Some browsers do not allow us to change the type, IE8
                    var canChangeType = (function() {

                        var canChange = true;

                        try {

                            element.attr('type', originalType);

                        } catch (e) {

                            canChange = false;

                            if (originalType === 'password') {

                                element.addClass('font--password');

                                // disable cut/copy/paste

                                element.on('cut copy paste', function(e) {
                                    e.preventDefault();
                                });

                            }

                        } finally {

                        }

                        return canChange;

                    })();

                    if ('placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea')) {
                        // has native support
                        return;
                    }


                    element.on('focus.placeholder', function(e) {

                        if (element.val() === attrs.placeholder) {

                            element.val('');

                            element.removeClass('placeholder');

                            if (canChangeType) {
                                element.attr('type', originalType);
                            }
                        }
                    });

                    element.on('blur.placeholder', function(e) {

                        if (!element.val()) {

                            element.val(attrs.placeholder);

                            element.addClass('placeholder');

                            if (canChangeType) {
                                element.attr('type', 'text');
                            }
                        }
                    });

                    scope.$on('$destroy', function(e) {
                        element.off('.placeholder');
                    });

                    $timeout(function() {

                        if (!element.val()) {

                            element.val(attrs.placeholder);

                            element.addClass('placeholder');

                            if (canChangeType) {
                                element.attr('type', 'text');
                            }

                        }
                    });

                    if (ctrl) {

                        // View -> Model
                        ctrl.$parsers.push(function(data) {
                            if (!data) {
                                return;
                            }

                            if (data === attrs.placeholder) {
                                element.addClass('placeholder');
                                return;
                            } else {
                                element.removeClass('placeholder');
                            }

                            return data;
                        });

                        // Model -> View
                        ctrl.$formatters.push(function(data) {
                            if (!data) {
                                return;
                            }

                            if (data === attrs.placeholder) {
                                element.addClass('placeholder');
                            } else {
                                element.removeClass('placeholder');
                            }

                            return data;
                        });

                    }
                }
            };
        }
    ])

    .directive('watchHeight', ['$window', 'safeApply',
        function($window, safeApply) {
            return {
                link: function(scope, element, attrs) {

                    // scope.$watch(function() {
                    //     scope[attrs.watchHeight] = element.height();
                    // });

                    safeApply(function() {
                        scope[attrs.watchHeight] = element.height();
                    }, scope);

                    angular.element($window).on('resize.watchHeight', function(e) {
                        safeApply(function() {
                            scope[attrs.watchHeight] = element.height();
                        }, scope);
                    });

                    scope.$on('$destroy', function() {
                        angular.element($window).off('.watchHeight');
                    });
                }
            };
        }
    ])

    .directive('modal', ['$window',
        function($rootScope, $window) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    element.on('click.modal', function(e) {

                        // Check if we're at the desktop breakpoint
                        if (scope.mq.lg) {

                            // Prevent click from redirecting user (if its an anchor)
                            e.preventDefault();

                            var modal = attrs.href.substr(0, attrs.href.lastIndexOf('.')) || attrs.href;

                            // Call show modal function with modal name
                            scope.showModal(modal);

                        }

                    });

                    scope.$on('$destroy', function() {
                        element.off('.modal');
                    });
                }
            };
        }
    ])

    .directive('smClick', ['$parse', 'safeApply',
        function($parse, safeApply) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    var fn = $parse(attrs.smClick);

                    element.on('click.smClick', function(event) {

                        if (scope.mq.sm) {

                            safeApply(fn(scope, {
                                $event: event
                            }), scope);

                        }

                    });

                    scope.$on('$destroy', function() {
                        element.off('.smClick');
                    });
                }
            };
        }
    ])

    .directive('mdClick', ['$parse', 'safeApply',
        function($parse, safeApply) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    var fn = $parse(attrs.smClick);

                    element.on('click.mdClick', function(event) {

                        if (scope.mq.md) {

                            safeApply(fn(scope, {
                                $event: event
                            }), scope);

                        }

                    });

                    scope.$on('$destroy', function() {
                        element.off('.smClick');
                    });
                }
            };
        }
    ])

    .directive('lgClick', ['$parse', 'safeApply',
        function($parse, safeApply) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {

                    var fn = $parse(attrs.lgClick);

                    element.on('click.lgClick', function(event) {

                        if (scope.mq.lg) {

                            safeApply(fn(scope, {
                                $event: event
                            }), scope);

                        }

                    });

                    scope.$on('$destroy', function() {
                        element.off('.lgClick');
                    });
                }
            };
        }
    ])

    ;

}).call(this);
