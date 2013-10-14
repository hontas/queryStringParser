(function () {

	// split url at ?-mark if needs be
	function getUrlParams(url) {
		if (/\?/.test(url)) {
			var arr = url.split('?');
			return arr[arr.length-1];
		} else {
			return url;
		}
	}
	
	/**
	 * @function parseURIGetParams
	 * Returns object containing key-value-pairs
	 * @param [String] complete url, url search segment or urlEncoded string
	 * @return [Object]
	 */
	var parseURIGetParams = function parseURIGetParams(url) {

		if ("string" !== typeof url) {
			throw new Error("Input parameter must be of type 'string'");
		}

		// decode URIComponent and remove starting questionmark
		var keyValuePairs = decodeURIComponent(getUrlParams(url)).split('&'),
			res = {};

		// extract key and value from each pair and add it to res-object
		keyValuePairs.forEach(function(pair) {
			var keyValArr = pair.split('='),
				key = keyValArr[0],
				val = keyValArr[1];

			// split val into array if it contains + (plus-sign)
			if (/\+/.test(val)) {
				val = val.split('+');
			}

			// if key exists and it contains an array, concat!
			if (res[key] && Array.isArray(res[key])) {
				res[key] = res[key].concat(val);
			} else {
				// set key and value on res object
				res[key] = val;
			}
		});

		// return object
		return res;
	};

	// expose globally
	window.parseURIGetParams = parseURIGetParams;

})();