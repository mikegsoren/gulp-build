(function() {
    var vp = document.getElementById('viewport');
    var width = (!/tablet|iPad/i.test(navigator.userAgent) && /[^-]mobi/i.test(navigator.userAgent)) ? '320' : '1024';
    vp.setAttribute('content', 'target-densitydpi=device-dpi, width=' + width + ', user-scalable=0, minimal-ui');
})();
