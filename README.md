[node]: http://nodejs.org/
[mocha]: http://visionmedia.github.io/mocha/
[Karma]: http://karma-runner.github.io/0.10/
[Chai]: http://chaijs.com/
[Sublime]: http://www.sublimetext.com/
[Sinon]: http://sinonjs.org/
[karma-sinon-chai]: https://npmjs.org/package/karma-sinon-chai
[decodeURIComponent]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent

# Test driving TDD

A friend asked me the other day - *Using only JavaScript, how can I read get-parameters from a url and parse it into an object?* And I thought - *that's a perfect opportunity for a little TDD!*

He wanted to turn `?taste=sweet%2Bsour&taste=salty%2Bdelicious&taste=frosty&start=&end=` into a JavaScript object. We'll use this as our requirements.

```js
{
	taste: [sweet, sour, salty, delicious, frosty],
	start: "",
	end: ""
}
```

I'm assuming you have som knowledge of JavaScript, [node][node] installed and know your way around a shell such as the [Terminal](http://en.wikipedia.org/wiki/Terminal_(OS_X)) or [Bash](http://en.wikipedia.org/wiki/Bash_(Unix_shell)).


## Setup

We'll be using [node][node] and [Karma][Karma] with the [mocha][mocha] test framework and [Chai][Chai] assertion library (they come bundled with Karma). I'll be using [my favorite text editor][Sublime], you can use wichever you like.

### Karma
Create a new folder for the project, navigate to it (I named mine *queryStringParser*) and install [Karma][Karma].
```
mkdir queryStringParser
cd queryStringParser
npm install karma
```

Next we'll create a configuration file for [Karma][Karma] using it's `init`-command. Below is how I answered the questions (to move on to the next question just hit enter on empty line).
```
karma init
```
```
testing framework: mocha
Require.js: no
Capture browser: Chrome, Firefox
Location of source/test files: js/*.js
Location of source/test files: test/**/*-test.js
Watch all the files: yes
```

Open the created karma.conf.js in your favorite editor and add 'chai' to frameworks and 'osx' to reporters (if you're on a mac)
```
frameworks: ['mocha', 'chai'],
reporters: ['progress', 'osx']
```

Finally create two files, `js/queryStringParser.js` and `test/queryStringParser-test.js` and let the testing commence by typing
```
karma start
```


## Writing tests

Open up `test/queryStringParser-test.js` and write
```js
describe("queryStringParser", function() {
	it("should exist", function() {
		expect(queryStringParser).to.exist;
	});
});
```

Save the file and take a look at the test, it should fail, case we haven't written our function yet. Let's do that. In `js/queryStringParser.js` write

```js
var queryStringParser = function(queryString) {};
```

Take a look at the test again, it should now be green. Awesome! Test driven! Give yourself a big pat on the back and let's continue. Our approach is not to write any code without first having written a failing test, so let's do that - below the last test (it), add another one:

```js
	it("should return an object", function() {
		expect(queryStringParser('')).to.be.an("object");
	});
```

Make sure it's failing, and then fix it

```js
var queryStringParser = function(queryString) {
	return {};
};
```

We only strive to make the test pass, nothing more. This way we'll know that our code has good test coverage.

Since we will be handling queryStrings we should write a test to make sure the the input is a string, we'll write an asynchronous test for this. Meaning that the test case will be fulfilled when `done()` is called, you'll se.

```js
it("should throw error if input is not a string", function(done) {
	try {
		queryStringParser();
	} catch (e) {
		done();
	}
});
```

Theese kind of tests are perfect for testing callbacks and such. However if you wish to test other asynchronous flows, like ajax-calls it's way better to implement [Sinon][Sinon] which is a great tool for testing with spies, mocks, stubs and fake timers. There's a plugin called [karma-sinon-chai][karma-sinon-chai] that you can use. Now to fix our failing test:

```js
var queryStringParser = function(queryString) {
	if ("string" !== typeof queryString) {
		throw new Error("Input parameter must be string");
	}
	return {};
};
```

Ok perfect, now what's our next step? We could do one of the following, decoding the queryString, removing the question mark or dividing the input into key/value-pairs that will be on the returned object. We'll start with this because only after taht can we test for the others.

```js
it("should return object with kays extracted from queryString", function(done) {
	expect(queryStringParser('key=value&prop=thing')).to.have.keys(['key', 'prop']);
});
```

One small step for the test, a giant leap for our function:

```js
var queryStringParser = function(queryString) {
	if ("string" !== typeof queryString) {
		throw new Error("Input parameter must be string");
	}

	var ret = {};

	// extract key/value-pairs
	queryString.split('&').forEach(function(keyVal) {
		ret[keyVal.split('=')[0]] = "";
	});

	return ret;
};
```

And then a test to make sure that the value makes it through aswell, we just append the earlier test:

```js
it("should return object with kays extracted from queryString", function(done) {
	var res = queryStringParser('key=value&prop=thing');
	expect(res).to.have.property('key').that.equal('value');
	expect(res).to.have.property('prop').that.equal('thing');
});
```

Make sure the tests are failing, and then:

```js
	queryString.split('&').forEach(function(keyVal) {
		var keyValArr = keyVal.split('='),
			key = keValArr[0],
			val = keyValArr[1];
		ret[key] = val;
	});
```

Now let's get rid of that question mark!

```js
it("should remove the initial question mark from queryString", function() {
	expect(queryStringParser("?key=val")).to.have.property("key");
});

```

We'll use slice [because of this](http://jsperf.com/substring-extraction-methods-substring-substr-slice) and I like it.

```js
queryString = queryString.slice(1);
```

Ok now let's decode the query string with [decodeURIComponent][decodeURIComponent].

```js
it("should replace each escaped sequence in the encoded URI component", function() {
	var res = queryStringParser("?author=Arthur%20C.%20Clarke");
	expect(res.author).to.equal("Arthur C. Clarke");
});
```
Make it fail, then make it right!

```js
queryString = decodeURIComponent(queryString.slice(1));
```

It appears my friend wishes to turn %2B or + (plus sign) into array. I say ok. `to.eql`and `to.deep.equal` is the same.

```js
it("should turn +-separated values into array", function() {
	var res = queryStringParser("?letters=A%2BB%2BC%2BD");
	expect(res.letters).to.eql(['A', 'B', 'C', 'D']);
});
```

Make it fly

```js
	// meanwhile in the forEach...
	if (/\+/.test(val)) {
		val = val.split("+");
	}
	ret[key] = val;
```

