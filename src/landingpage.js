(function() {
	var BrowserStorage = require('./browserstorage')();

	document.currentScript = document.currentScript || (function() {
		var scripts = document.querySelectorAll('[data-name="oalanding"]');
		if (scripts[0]) {
			return scripts[0];
		}
		scripts = document.querySelectorAll('[data-advertiser]');
		return scripts[0];
	})();

	if (document.currentScript) {
		var param = document.currentScript.getAttribute('data-param') || 'oa_id';
		var cookie_days = document.currentScript.getAttribute('data-cookie-days') || '30';

		// extract clickid from query string (https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513)
		var click_id = decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

		if (click_id) {
			BrowserStorage.set('oa-click-id', click_id, cookie_days);
		}
	}
}).call(this);
