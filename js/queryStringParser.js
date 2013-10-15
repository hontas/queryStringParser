(function () {

	function deQuestionMarkify(str) {
		return str.charAt(0) === "?" ? str.slice(1) : str;
	}
	
	var queryStringParser = function(queryString) {
		if ("string" !== typeof queryString) {
			throw new Error("Input parameter must be string");
		}

		var decodedString = decodeURIComponent(deQuestionMarkify(queryString)),
			ret = {};

		// extract key/value-pairs
		decodedString.split('&').forEach(function(keyVal) {
			var keyValArr = keyVal.split('='),
				key = keyValArr[0],
				val = keyValArr[1];

			if (/\+/.test(val)) {
				val = val.split("+");
			}

			if (ret[key] && Array.isArray(ret[key])) {
				val = ret[key].concat(val);
			}

			ret[key] = val;

		});

		return ret;
	};

	// expose globally
	window.queryStringParser = queryStringParser;

})();