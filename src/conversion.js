(function() {
	var domready = require("domready");
	var cs = document.currentScript || (function() {
		var scripts = document.querySelectorAll('[data-name="oaconversion"]');
		if (scripts[0]) {
			return scripts[0];
		}
		scripts = document.querySelectorAll('[data-advertiser]');
		return scripts[0];
	})();

	domready(function(){
		var BrowserStorage = require('./browserstorage')();

		if (cs) {
			var currentScript = cs;
			var advertiser = cs.getAttribute('data-advertiser');
			var advertiser_domain = cs.getAttribute('data-advertiser-domain');
			var offer_hash = cs.getAttribute('data-offer-hash');
			var offer_id = cs.getAttribute('data-offer-id');
			var unique_conversion_id = cs.getAttribute('data-unique-conversion-id');
			var ordervalue = cs.getAttribute('data-ordervalue');
			var event_id = cs.getAttribute('data-event-id');
	
			if (advertiser_domain == '' || advertiser_domain === null) {
				alert('OA Conversion: missing advertiser domain (GTM users enable document.write)');
			} else if (offer_id == '' || offer_id === null) {
				alert('OA Conversion: missing offer id');
			} else if (offer_hash == '' || offer_hash === null) {
				alert('OA Conversion: missing offer hash');
			}
	
			var click_id = BrowserStorage.get('oa-click-id');
	
			if(!click_id || click_id == '') {
				// check if click_id is in current url
				var param = cs.getAttribute('data-param') || cs.getAttribute('data-params') || 'oa_id';
				var params = param.split(',');
				for (var i=0;i<params.length;i++) {
					var x = params[i].replace(/^\s+|\s+$/gm,'');
					if (x.length) {
						click_id = decodeURIComponent((new RegExp('[?|&]' + x + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
			
						if(click_id) {
							break;
						}
					}
				}
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
				currentScript.onerror();
			}
		} else {
			alert('OA Conversion pixel error!');
		}
	});
}).call(this);
