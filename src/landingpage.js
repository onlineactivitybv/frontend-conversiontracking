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
		var param = document.currentScript.getAttribute('data-param') || document.currentScript.getAttribute('data-params') || 'oa_id';
		var params = param.split(',');
		var cookie_days = document.currentScript.getAttribute('data-cookie-days') || '30';

		var click_id = false; 
		for (var i=0;i<params.length;i++) {
			var x = params[i].replace(/^\s+|\s+$/gm,'');
			if (x.length) {
				click_id = decodeURIComponent((new RegExp('[?|&]' + x + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	
				if(click_id) {
					break;
				}
			}
		}

		if (click_id) {
			BrowserStorage.set('oa-click-id', click_id, cookie_days);
		}
	}
}).call(this);
