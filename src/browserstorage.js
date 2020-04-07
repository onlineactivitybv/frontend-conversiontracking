/* 
* Based on https://stackoverflow.com/a/23838252/448426
* Modified to use both localStorage and cookies redundantly instead as fallback and to store cookies on root domain
*/

module.exports = (function BrowserStorage() {
	/**
	 * Whether the current browser supports local storage as a way of storing data
	 * @var {Boolean}
	 */
	var _hasLocalStorageSupport = (function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	})();

	/**
	 * @param {String} name The name of the property to read from this document's cookies
	 * @return {?String} The specified cookie property's value (or null if it has not been set)
	 */
	var _readCookie = function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}

		return null;
	};

	/**
	 * @param {String} name The name of the property to set by writing to a cookie
	 * @param {String} value The value to use when setting the specified property
	 * @param {Number} [days] The number of days until the storage of this item expires
	 */
	var _writeCookie = function (name, value, days) {
		var expiration = (function () {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				return "; expires=" + date.toUTCString();
			}
			else {
				return "";
			}
		})();

		var domain = (function () {
			var i = 0, domain = document.domain, p = domain.split('.'), s = '_gd' + (new Date()).getTime();
			while (i < (p.length - 1) && document.cookie.indexOf(s + '=' + s) == -1) {
				domain = p.slice(-1 - (++i)).join('.');
				document.cookie = s + "=" + s + ";domain=" + domain + ";";
			}
			document.cookie = s + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + domain + ";";
			return domain;
		})();
		document.cookie = name + "=" + value + expiration + "; path=/;domain=" + domain;
	};

	return {
		/**
		 * @param {String} name The name of the property to set
		 * @param {String} value The value to use when setting the specified property
		 * @param {Number} [days] The number of days until the cookie of this item expires 
		 */
		set: function (name, value, days) {
			if (_hasLocalStorageSupport) {
				localStorage.setItem(name, value);
			}
			_writeCookie(name, value, days);
		},

		/**
		 * @param {String} name The name of the value to retrieve
		 * @return {?String} The value of the 
		 */
		get: function (name) {
			if (_hasLocalStorageSupport && localStorage.getItem(name)) {
				return localStorage.getItem(name);
			}
			return _readCookie(name);
		},

		/**
		 * @param {String} name The name of the value to delete/remove from storage
		 */
		remove: function (name) {
			if (_hasLocalStorageSupport) {
				localStorage.removeItem(name)
			}
			this.set(name, "", -1);
		}
	};
});
