(function() {
    'use strict';

    angular.module('cdmp.controllers')

    .controller('ModalController', ['$scope', '$rootScope', '$window', '$document', '$timeout', 'close', '_',
        function($scope, $rootScope, $window, $document, $timeout, close, _) {

            $scope.isModal = true;

            var closeEnabled = true;

            $scope.close = function() {
                if (closeEnabled) {
                    close();
                }
            };

            $scope.repaint = function($event) {

                if ($(document.activeElement).is('input')) {
                    return;
                }

                var div = $event.currentTarget;
                div.style.display = 'none';
                var tmp = div.offsetHeight;
                div.style.display = 'block';
            };

            $($document).on('keydown.modal', function(e) {
                if (e.keyCode === 27) {
                    $scope.close();
                }
            });

            $scope.$on('close:disable', function(event, data) {
                closeEnabled = false;
            });
            $scope.$on('close:enable', function(event, data) {
                closeEnabled = true;
            });

            var closeListener = $rootScope.$on('close:modal', function(event, data) {
                close();
            });

            // Close if we hit the mobile breakpoint
            var queryListener = $rootScope.$watch('mq.sm', function(newValue, oldValue) {
                if (newValue === true) {
                    close();
                }
            });

            $scope.$on('$destroy', function(e) {
                closeListener();
                queryListener();
                $($document).off('.modal');
            });
        }
    ]);

}).call(this);
