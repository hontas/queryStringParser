describe("queryStringParser", function() {

	it("should be a function", function() {
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

	it("should return object with keys extracted from queryString", function() {
		var res = queryStringParser('key=value&prop=thing');
		expect(res).to.have.property('key').that.equal('value');
		expect(res).to.have.property('prop').that.equal('thing');
	});

	it("should remove the initial question mark from queryString", function() {
		expect(queryStringParser("?key=val")).to.have.property("key");
	});

	it("should replace each escaped sequence in the encoded URI component", function() {
		var author = "Arthur C. Clarke",
			res = queryStringParser("?author=" + encodeURIComponent(author));
		expect(res.author).to.equal(author);
	});

	it("should turn +-separated values into array", function() {
		var letters = "A+B+C+D",
			res = queryStringParser("?letters=" + encodeURIComponent(letters));
		expect(res.letters).to.eql(letters.split("+"));
	});

	it("should concatenate values to keys that already hold an array", function() {
		var res = queryStringParser("nums=1%2B2&nums=3%2B4");
		expect(res.nums).to.eql(['1', '2', '3', '4']);
	});

	it('should turn old value into an array if there are more values for same key and concatenate them', function() {
		var res = queryStringParser("nums=1&nums=2&nums=3%2B4");
		expect(res.nums).to.eql(['1', '2', '3', '4']);
	})

	it("should meet the requirements", function() {
		var str = '?taste=sweet%2Bsour&taste=salty%2Bdelicious&taste=frosty&start=&end=',
			res = queryStringParser(str);
		expect(res).to.have.property('taste')
			.that.eql(['sweet', 'sour', 'salty', 'delicious', 'frosty']);
		expect(res).to.have.property('start').that.equal("");
		expect(res).to.have.property('end').that.equal("");
	});

	it('should be able to handle a whole URL', function() {
		var str = 'http://example.com/?cow=muu&cat=meow',
			res = queryStringParser(str);
		expect(res).to.have.property('cow').that.equal('muu');
		expect(res).to.have.property('cat').that.equal('meow');
	})
});