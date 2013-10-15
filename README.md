[node]: http://nodejs.org/
[mocha]: http://visionmedia.github.io/mocha/
[Karma]: http://karma-runner.github.io/0.10/
[Chai]: http://chaijs.com/
[Sublime]: http://www.sublimetext.com/
[Sinon]: http://sinonjs.org/
[karma-sinon-chai]: https://npmjs.org/package/karma-sinon-chai
[decodeURIComponent]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
[githubProj]: github.com/hontas/queryStringParser

# Test driving TDD

A friend asked me the other day - *Using only JavaScript, how can I read get-parameters from a url and parse it into an object?* And I thought - *that's a perfect opportunity for a little TDD!* Note: we'll be writing test in a BDD-flavoured way.

He wanted to turn `?taste=sweet%2Bsour&taste=salty%2Bdelicious&taste=frosty&start=&end=` into a JavaScript object that should look like this:

```js
{
	taste: [sweet, sour, salty, delicious, frosty],
	start: "",
	end: ""
}
```

That will be our requirements.

I'm assuming you have some knowledge of JavaScript, [node][node] installed and that you know your way around a shell such as the [Terminal](http://en.wikipedia.org/wiki/Terminal_(OS_X)) or [Bash](http://en.wikipedia.org/wiki/Bash_(Unix_shell)).

You can go one of two ways here, either you keep reading this document which holds both the test cases and my solutions to them, or you can go to [another document I prepared]() where I leave out my solutions and can try your own, free from the distraction of mine.

All files can be found here: [github.com/hontas/queryStringParser][githubProj]

## Setup

We'll be using [node][node] and [Karma][Karma] with the [mocha][mocha] test framework and [Chai][Chai] assertion library (they come bundled with Karma). I'll be using [my favorite text editor][Sublime], you can use whichever you like.

Create a new folder for the project and navigate to it (I named mine *queryStringParser*)

```
mkdir queryStringParser
cd queryStringParser
```

### npm
For good measure let's create a package.json (my answer below).

```
npm init
```
* description: *Takes a query string and parses it to a JavaScript object*
* entry point: *js/queryStringParser.js*
* test command: *karma start*
* author: *hontas*


### Karma

Install [Karma][Karma]. I found that installing karma globally was a whole lot easier than installing it locally, I'll show you both ways and you can choose whichever you prefer.

#### Installing Karma locally

```
npm install karma --save-dev
npm install karma-mocha --save-dev
npm link mocha
npm install karma-chrome-launcher --save-dev
npm install karma-firefox-launcher --save-dev
```

#### Installing Karma globally

```
npm install -g karma
```

Create a configuration file (my answers below).
```
karma init
```
* testing framework: *mocha*
* Require.js: *no*
* Capture browser: *Chrome, Firefox*
* Location of source/test files: _js/\*.js_
* Location of source/test files: _test/\*\*/\*-test.js_
* Watch all the files: *yes*

Open the newly created file karma.conf.js in your favorite text editor and add 'chai' to frameworks. If you did the local install you probalbly have to `npm install karma-chai --save-dev` to make it work. And if you're on a mac, you should also add the osx-reporter: `npm install karma-osx-reporter --save-dev` since it's very handy.

```js
frameworks: ['mocha', 'chai'],
reporters: ['progress', 'osx'],
```

Finally create two files, `js/queryStringParser.js` and `test/queryStringParser-test.js`. You should also add a `README.md`. If you're reading this on github, then this is that file.

Finally try it out by typing `npm test` or `karma start` (the first is linked to the latter in package.json). That should start up Chrome and Firefox and in the terminal/bash it should say something like `[...] Executed 0 of 0 ERROR (0.1 secs / 0 secs)` which is fine since we haven't written any tests yet.


## Writing tests

The philosophy of test driven deleopment is that you cannot write a single line of code without having a failing test case first (you can [read more about that here](http://en.wikipedia.org/wiki/Test-driven_development)).

### Our first failing test case

We're using [mocha][mocha] with [Chai][Chai] as assertian library, to read up on the Chai-syntax, [take a look here](http://chaijs.com/api/bdd/) and keep it open for reference. Next open up `test/queryStringParser-test.js` and enter:

```js
describe("queryStringParser", function() {
	it("should be a function", function() {
		expect(queryStringParser).to.exist;
		expect(queryStringParser).to.be.a('function');
	});
});
```

Save the file and take a look at the tests in terminal/bash - they should fail (if they're not running get them started by typing `npm test`). Now let's fix the failing test. In `js/queryStringParser.js` enter:

```js
var queryStringParser = function(queryString) {};
```
### The failing test case is strong with this one

Take a look at the test again, it should now be green. Awesome! Test driven development FTW! Give yourself a big pat on the back and let's continue. Our approach is to **not write any code** without **first having written a failing test**, so let's do that (below the first it):

```js
it("should return an object", function() {
	var res = queryStringParser();
	expect(res).to.be.an("object");
});
```

Make sure it's failing, and then fix it:

```js
var queryStringParser = function(queryString) {
	return {};
};
```

### The principle of least effort

We only want to make the test pass, **nothing more**.

Since we will be handling queryStrings we should write a test to make sure the the input is a string. We'll do that with an *asynchronous* test, meaning that the test case will not be fulfilled untill `done()` is called. Notice the `done` in `function(done)` and when it's called within the catch-block.

```js
it("should throw error if input is not a string", function(done) {
	try {
		queryStringParser();
	} catch (e) {
		done();
	}
});
```

You can [read more about testing asynchronous code here](http://visionmedia.github.io/mocha/#asynchronous-code). Now to fix our failing test:

```js
var queryStringParser = function(queryString) {
	if ("string" !== typeof queryString) {
		throw new Error("Input parameter must be string");
	}
	return {};
};
```
### Test case ordering

Hmm, not working. Why? Because the second last test we wrote is now also failing, so let's add an empty string in that function call: `var res = queryStringParser('');` This would not had been a problem if we'd written the input test first. Something to remember.

That should do it! Now let's divide the queryString into key/value-pairs that will be on the returned object.

```js
it("should return object with keys extracted from queryString", function() {
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

### Extend the test case

And then a test to make sure that the value makes it through as well, we change the test into this:

```js
it("should return object with kays extracted from queryString", function() {
	var res = queryStringParser('key=value&prop=thing');
	expect(res).to.have.property('key').that.equal('value');
	expect(res).to.have.property('prop').that.equal('thing');
});
```

Make sure the tests are failing, and then:

```js
queryString.split('&').forEach(function(keyVal) {
	var keyValArr = keyVal.split('='),
		key = keyValArr[0],
		val = keyValArr[1];
	ret[key] = val;
});
```

### Remove the questionable mark

```js
it("should remove the initial question mark from queryString", function() {
	expect(queryStringParser("?key=val")).to.have.property("key");
});

```

I'm using slice but you can choose to use substr or substring if you wish. Take a look at [theese performance tests](http://jsperf.com/substring-extraction-methods-substring-substr-slice) before making up you mind. Add this above the forEach.

```js
if (queryString.charAt(0) === "?") {
	queryString = queryString.slice(1);
}
```
### Decode query string

For this we'll use [decodeURIComponent][decodeURIComponent].

```js
it("should replace each escaped sequence in the encoded URI component", function() {
	var res = queryStringParser("?author=Arthur%20C.%20Clarke");
	expect(res.author).to.equal("Arthur C. Clarke");
});
```

Make it fail, then make it right!

```js
if (queryString.charAt(0) === "?") {
	queryString = decodeURIComponent(queryString.slice(1));
} else {
	queryString = decodeURIComponent(queryString);
}
```

### Split by plus

Now it appears my friend wishes to split values containing `%2B` (`+`) into an array. I say ok. The expressions `to.eql` and `to.deep.equal` are the same.

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

### Concatenate values

According to our requirements one should be able to input the same key several times wich should append the values to the previous.

```js
it("should concatenate values to keys that already hold an array", function() {
	var res = queryStringParser("nums=1%2B2&nums=3%2B4");
	expect(res.nums).to.eql(['1', '2', '3', '4']);
});
```

Check if the key exist, and if it's an array, concatenate!

```js
if (ret[key] && Array.isArray(ret[key])) {
	val = ret[key].concat(val);
}
ret[key] = val;
```

I'm aware this will not work if the first value only holds one value, and no plus-sign, but I'm leaving it like this for now because this solution is sufficient to meet our requirements, when they change, we add more tests.

### Let's put it to the test

One final test to see that we meet the requirements just for the sake of this article, please don't name your own test cases that way.

```js
it("should meet the requirements", function() {
	var str = '?taste=sweet%2Bsour&taste=salty%2Bdelicious&taste=frosty&start=&end=',
		res = queryStringParser(str);
	expect(res).to.have.property('taste')
		.that.eql(['sweet', 'sour', 'salty', 'delicious', 'frosty']);
	expect(res).to.have.property('start').that.equal("");
	expect(res).to.have.property('end').that.equal("");
});
```

Halleluja, it's working! Praise the test driven JavaScript [flying spaghetti monster!](http://en.wikipedia.org/wiki/Flying_Spaghetti_Monster)

## Refactoring the code

With all thoose tests making sure our code is working you can go ahead and refactor it in a worry-free fashion! The latest version of the tests and the code is on [github][githubProj], and below is how far we have come now.

```js
// test/queryStringParser-test.js
describe("queryStringParser", function() {
	it("should be a function", function() {
		expect(queryStringParser).to.exist;
		expect(queryStringParser).to.be.a('function');
	});

	it("should return an object", function() {
		var res = queryStringParser("");
		expect(res).to.be.an("object");
	});

	it("should throw error if input is not a string", function(done) {
		try {
			queryStringParser();
		} catch (e) {
			done();
		}
	});

	it("should return object with kays extracted from queryString", function() {
		var res = queryStringParser('key=value&prop=thing');
		expect(res).to.have.property('key').that.equal('value');
		expect(res).to.have.property('prop').that.equal('thing');
	});

	it("should remove the initial question mark from queryString", function() {
		expect(queryStringParser("?key=val")).to.have.property("key");
	});

	it("should replace each escaped sequence in the encoded URI component", function() {
		var res = queryStringParser("author=Arthur%20C.%20Clarke");
		expect(res.author).to.equal("Arthur C. Clarke");
	});

	it("should turn +-separated values into array", function() {
		var res = queryStringParser("?letters=A%2BB%2BC%2BD");
		expect(res.letters).to.eql(['A', 'B', 'C', 'D']);
	});

	it("should concatenate values to keys that already hold an array", function() {
		var res = queryStringParser("nums=1%2B2&nums=3%2B4");
		expect(res.nums).to.eql(['1', '2', '3', '4']);
	});

	it("should meet the requirements", function() {
		var str = '?taste=sweet%2Bsour&taste=salty%2Bdelicious&taste=frosty&start=&end=',
			res = queryStringParser(str);
		expect(res).to.have.property('taste')
			.that.eql(['sweet', 'sour', 'salty', 'delicious', 'frosty']);
		expect(res).to.have.property('start').that.equal("");
		expect(res).to.have.property('end').that.equal("");
	});
});
```

```js
// js/queryStringParser.js
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
```

## Taking it further

This was one very simple function, but when you are working with, let's say objects and methods, then it's a good idea to nest the `describes` so that they reflect the structure of the code. I put a hash before method names and a dot before property names and I also frequently make use of `beforeEach` which executes before each test. Below is an eample to give you an idea. You can read more about it on [mocha's website](http://visionmedia.github.io/mocha/).

```js
describe("Person", function() {
	
	var person;

	beforeEach(function() {
		// one fresh instance of Person before each test
		person = new Person;
	});

	describe("#ctor", function() { // constructor
		it("should set correct properties", function() {
			expect(person.friends).to.be.an("array").with.length(0);
			expect(person.age).to.equal(0);
		});
	});

	describe("#fullName", function() { // method
		it("should return full name", function() {
			person.set('firstName', 'Donald');
			person.set('lastName', 'Duck');
			expect(person.fullName()).to.equal('Donald Duck');
		});
	});

	describe(".version", function() { // property
		it("should be 1.0.1", function() {
			expect(Person.version).to.equal('1.0.1');
		});
	});
});
```

## Conslusion

In the beginning of my testing I found it hard to define what and how to test. I'm still working on it, but it's more easy now, it comes naturally and I don't feel that it is slowing me down at all. But the best part for me is that when the initial tests are in place, refactoring is a breeze and I'm improving my code faster than ever, and coming back to an old piece of code I don't have to be afraid of breaking it, I can focus on a specific part instead of trying to understand the whole thing before I can begin improving it. It keeps me from trying to eat my knuckles, throwing around my computer and harrassing my invironment, it's a peacekeeper and someday I hope the [Nobel commity](http://www.nobelprize.org/) will aknowledge this soon.

Don't hesitate to give me feedback on how to improve spelling or the tests, if something is unclear or not working for you, I'll try and answer as fast as I can. Thank you for reading.