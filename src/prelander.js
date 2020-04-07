(function () {
	var domready = require("domready");
	var cs = document.currentScript || (function () {
		var scripts = document.querySelectorAll('[data-params]');
		if (scripts[0]) {
			return scripts[0];
		}
	})();

	domready(function () {

		var params = ['oa_clickid'];
		var link_selector = 'a[href], area[href]';
		var form_selector = 'form';
		var iframe_selector = 'iframe';

		if (cs) {
			var paramsdata = cs.getAttribute('data-params');
			var params = paramsdata.split(',');
			var linkselector_data = cs.getAttribute('data-link-selector');
			var formselector_data = cs.getAttribute('data-form-selector');
			var iframeselector_data = cs.getAttribute('data-iframe-selector');

			if (linkselector_data) {
				link_selector = linkselector_data;
			}
			if (formselector_data) {
				form_selector = formselector_data;
			}
			if (iframeselector_data) {
				iframe_selector = iframeselector_data;
			}
		}

		var found_params = [];
		var query_string_parts = [];

		for (var i = 0; i < params.length; i++) {
			var x = params[i].replace(/^\s+|\s+$/gm, '');
			if (x.length) {
				var value = decodeURIComponent((new RegExp('[?|&]' + x + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

				if (value) {
					found_params.push({
						name: x,
						value: value
					});

					query_string_parts.push(encodeURIComponent(x) + "=" + encodeURIComponent(value))
				}
			}
		}

		if (found_params.length) {
			// build query string
			var query_string = query_string_parts.join("&");

			// add to a-links
			var links = document.querySelectorAll(link_selector);
			for (var i = 0; i < links.length; i++) {
				var link = links[i].getAttribute('href');
				if (link.length && link.charAt(0) != '#') {
					var anchor_pos = link.indexOf('#');
					var anchorcontent = '';
					if (anchor_pos > -1) {
						anchorcontent = link.substring(anchor_pos + 1);
						link = link.substring(0, anchor_pos);
					}

					link += (link.indexOf('?') > -1 ? '&' : '?') + query_string;
					if (anchorcontent.length) {
						link += '#' + anchorcontent;
					}

					links[i].setAttribute('href', link);
				}
			}

			// add to forms
			var forms = document.querySelectorAll(form_selector);
			for (var i = 0; i < forms.length; i++) {
				var action = forms[i].getAttribute('action');
				var method = forms[i].getAttribute('method');

				// if post, add to action, otherwise add hidden inputs.
				if (method && method.toLowerCase() == 'post') {
					action = action === null ? '' : action;;
					if (action.charAt(0) != '#') {
						var anchor_pos = action.indexOf('#');
						var anchorcontent = '';
						if (anchor_pos > -1) {
							anchorcontent = action.substring(anchor_pos + 1);
							action = action.substring(0, anchor_pos);
						}

						action += (link.indexOf('?') > -1 ? '&' : '?') + query_string;
						if (anchorcontent.length) {
							action += '#' + anchorcontent;
						}

						forms[i].setAttribute('action', action);
					}
				} else {
					for (var j = 0; j < found_params.length; j++) {
						var p = found_params[j];
						var input = document.createElement('input');
						input.setAttribute('name', p.name);
						input.setAttribute('value', p.value);
						input.setAttribute('type', 'hidden');
						forms[i].appendChild(input);
					}
				}
			}
		} else {
			var query_string = '';
		}

		// add to iframes
		var iframes = document.querySelectorAll(iframe_selector);
		for (var i = 0; i < iframes.length; i++) {
			var link = iframes[i].getAttribute('src');
			if (!link || link == undefined || link.length == 0) {
				link = iframes[i].getAttribute('data-original-src');
			}
			if (link.length && link.charAt(0) != '#') {
				var anchor_pos = link.indexOf('#');
				var anchorcontent = '';
				if (anchor_pos > -1) {
					anchorcontent = link.substring(anchor_pos + 1);
					link = link.substring(0, anchor_pos);
				}

				link += (link.indexOf('?') > -1 ? '&' : '?') + query_string;
				if (anchorcontent.length) {
					link += '#' + anchorcontent;
				}

				iframes[i].setAttribute('src', link);
			}
		}
	});
}).call(this);
