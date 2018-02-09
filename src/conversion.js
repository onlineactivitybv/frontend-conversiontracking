(function() {
	var BrowserStorage = require('./browserstorage')();

	document.currentScript = document.currentScript || (function() {
		var scripts = document.querySelectorAll('[data-name="oaconversion"]');
		if (scripts[0]) {
			return scripts[0];
		}
		scripts = document.querySelectorAll('[data-advertiser]');
		return scripts[0];
	})();
	

	if (document.currentScript) {
		var currentScript = document.currentScript;
		var advertiser = document.currentScript.getAttribute('data-advertiser');
		var advertiser_domain = document.currentScript.getAttribute('data-advertiser-domain');
		var offer_hash = document.currentScript.getAttribute('data-offer-hash');
		var offer_id = document.currentScript.getAttribute('data-offer-id');
		var unique_conversion_id = document.currentScript.getAttribute('data-unique-conversion-id');
		var ordervalue = document.currentScript.getAttribute('data-ordervalue');
		var event_id = document.currentScript.getAttribute('data-event-id');

		if (advertiser_domain == '') {
			alert('OA Conversion: missing advertiser domain');
		}
		if (offer_id == '') {
			alert('OA Conversion: missing offer id');
		}
		if (offer_hash == '') {
			alert('OA Conversion: missing offer hash');
		}

		var click_id = BrowserStorage.get('oa-click-id');

		if(!click_id || click_id == '') {
			// check if click_id is in current url
			var param = document.currentScript.getAttribute('data-param') || 'oa_id';
			click_id = decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
		}

		// request script-callback; with or without oa-click-id
		var data = {
			advertiser: advertiser,
			unique_conversion_id: unique_conversion_id,
			ordervalue: ordervalue, 
			click_id: click_id
		}
		
		var form_data = new FormData();
		for (var key in data ) {
		    form_data.append(key, data[key]);
		}
		var url = window.location.protocol == 'http:' ? 'http' : 'https';
		url += '://' + advertiser_domain;
		url += '/m/' + offer_id + '/' + offer_hash + '/?unique_conversion_id=' + encodeURIComponent(unique_conversion_id);
		
		if(event_id && event_id != '') {
			url += '&event=' + encodeURIComponent(event_id); 
		}

		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr){
			xhr.open('POST', url, true);
			xhr.withCredentials = true;
			xhr.onerror = function(e) {
				// error; call image pixel as fallback
				currentScript.onerror();
			}
			xhr.onload = function(e) {
				if (this.readyState == 4 && this.status == 200) {
					var response = JSON.parse(this.responseText); 
					if(response.alt_image_pixel) {
						// request image pixel alternate (to fetch cookies on possible other domains) 
						var altImage = document.createElement('img'); 
						altImage.src = response.alt_image_pixel;
						altImage.style.width = '1px';
						altImage.style.height = '1px';
						altImage.style.border = '0px';
					
						document.body.appendChild(altImage);
					}
				}
			}
			xhr.send(form_data);
			
		} else {
			// NO XHR2; image pixel!
			document.currentScript.onerror();
		}
	} else {
		alert('OA Conversion pixel error!');
	}
}).call(this);
