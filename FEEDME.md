[node]: http://nodejs.org/
[mocha]: http://visionmedia.github.io/mocha/
[Karma]: http://karma-runner.github.io/0.10/
[Chai]: http://chaijs.com/
[Sublime]: http://www.sublimetext.com/
[Sinon]: http://sinonjs.org/
[karma-sinon-chai]: https://npmjs.org/package/karma-sinon-chai
[decodeURIComponent]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
[githubProj]: github.com/hontas/queryStringParser
[terminalWiki]: http://en.wikipedia.org/wiki/Terminal_(OS_X)
[bashWiki]: http://en.wikipedia.org/wiki/Bash_(Unix_shell)
[BDD]: http://en.wikipedia.org/wiki/Behavior-driven_development
[TDD]: http://en.wikipedia.org/wiki/Test-driven_development

# Test driving TDD - the fast track

Project files and a more thoughrough article can be found here: [github.com/hontas/queryStringParser][githubProj]. It contains information on how to set up an environment for JavaScript testing and provide solutions to the tests as well, but here we focus only on the tests. I'm using [the mocha test framework][mocha] with [Chai][Chai] as assertion library, and I'm writing the tests in the flavour of [BDD][BDD].

## Requirements

Turn the query string `?taste=sweet%2Bsour&taste=salty%2Bdelicious&taste=frosty&start=&end=` into a JavaScript object that look like this:

```js
{
	taste: [sweet, sour, salty, delicious, frosty],
	start: "",
	end: ""
}
```

## Writing tests

The philosophy of [Test Driven Deleopment][TDD] is that you cannot write a single line of code without first having written a failing test case. So let's start with that.

### Our first failing test case

```js
describe("queryStringParser", function() {
	it("should be a function", function() {
		expect(queryStringParser).to.exist;
		expect(queryStringParser).to.be.a('function');
	});
});
```
Now produce **only the code neccesary** to make the test not fail. Then write another failing test case. Produce the mininum amount of code to make it work. Keep doing this until you're done. At all times following [the principle of least effort](http://en.wikipedia.org/wiki/Principle_of_least_effort).

### Test input

```js
it("should throw error if input is not a string", function(done) {
	try {
		queryStringParser();
	} catch (e) {
		done();
	}
});
```

### Test type of output

```js
it("should return an object", function() {
	var res = queryStringParser();
	expect(res).to.be.an("object");
});
```

### Test output data	

```js
it("should return object with keys extracted from queryString", function() {
	expect(queryStringParser('key=value&prop=thing')).to.have.keys(['key', 'prop']);
});
```
### Extend the output data test case

```js
it("should return object with keys extracted from queryString", function() {
	var res = queryStringParser('key=value&prop=thing');
	expect(res).to.have.property('key').that.equal('value');
	expect(res).to.have.property('prop').that.equal('thing');
});
```
### Manipulate input

```js
it("should remove the initial question mark from queryString", function() {
	expect(queryStringParser("?key=val")).to.have.property("key");
});

```
### Decode query string

```js
it("should replace each escaped sequence in the encoded URI component", function() {
	var res = queryStringParser("?author=Arthur%20C.%20Clarke");
	expect(res.author).to.equal("Arthur C. Clarke");
});
```
### Split by plus

```js
it("should turn +-separated values into array", function() {
	var res = queryStringParser("?letters=A%2BB%2BC%2BD");
	expect(res.letters).to.eql(['A', 'B', 'C', 'D']);
});
```
### Concatenate values

```js
it("should concatenate values to keys that already hold an array", function() {
	var res = queryStringParser("nums=1%2B2&nums=3%2B4");
	expect(res.nums).to.eql(['1', '2', '3', '4']);
});
```

### One final test (to rule them all)

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

## Congratulations!

**You made it!** Praise [the flying spaghetti monster](http://en.wikipedia.org/wiki/Flying_Spaghetti_Monster) for test driven JavaScript!

You can now start your journey towards taking your code to 2.0 by refactoring it in a worry-free fashion!

Want to compare your results to mine or give me feedback? Here's the place for that: [github.com/hontas][githubProj]. Have a great day!

//Pontus