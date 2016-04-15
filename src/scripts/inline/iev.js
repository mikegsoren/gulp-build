(function(ua) {
    window.__ie = null;
    if (/msie|trident/i.test(ua)) {
        var version = (function() {
            var match = ua.match(/(?:msie |rv:)(\d+(\.\d+)?)/i);
            var version = (match && match.length > 1 && match[1]) || '';
            return parseInt(version, 10);
        })();
        var key = 'ie';
        var min = 6;
        var max = 12;
        var klass = ['eq-ie'];
        for (var v = min; v <= max; v++) {
            if (version > v) {
                klass.push('gt-' + key + v);
            } else if (version < v) {
                klass.push('lt-' + key + v);
            } else if (version === v) {
                klass.push('lte-' + key + v);
                klass.push('eq-' + key + v);
                klass.push('gte-' + key + v);
            }
        }
        window.__ie = version;
        document.documentElement.className += ' ' + klass.join(' ');
    }
})(navigator.userAgent || '');
