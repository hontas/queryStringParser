var queryStringParser = function(queryString) {
	if ("string" !== typeof queryString) {
		throw new Error("Input parameter must be string");
	}

	var ret = {};

	if (queryString.charAt(0) === "?") {
		queryString = decodeURIComponent(queryString.slice(1));
	} else {
		queryString = decodeURIComponent(queryString);
	}

	// extract key/value-pairs
	queryString.split('&').forEach(function(keyVal) {
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