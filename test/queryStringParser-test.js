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