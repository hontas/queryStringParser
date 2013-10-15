(function () {

	function splitByQMark(str) {
		var arr = str.split("?");
		return arr[arr.length - 1];
	}
	
	var queryStringParser = function(queryString) {
		if ("string" !== typeof queryString) {
			throw new Error("Input parameter must be string");
		}

		var decodedString = decodeURIComponent(splitByQMark(queryString)),
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