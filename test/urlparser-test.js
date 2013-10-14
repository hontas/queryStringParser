// input:
// ?parties=m%2Bfp%2Bkd%2Bc&parties=s%2Bv%2Bmp&parties=sd&endYear=&end=&startYear=&start=
// 
// output:
// {
//   parties: [sd, m, p],
//   endYear='',
//   end=''
// }


describe('parseURIGetParams', function() {

	var url = "?parties=s%2Bv%2Bmp&endYear=&end=&startYear=&start=",
		res,
		tinyUrl = "?parties=mp",
		tinyRes,
		arrayUrl = "?parties=m%2Bfp%2Bkd%2Bc&parties=s%2Bv%2Bmp&parties=pp",
		arrayRes;

	beforeEach(function() {
		res = parseURIGetParams(url);
		tinyRes = parseURIGetParams(tinyUrl);
		arrayRes = parseURIGetParams(arrayUrl);
	});
	
	it('should exist', function() {
		expect(parseURIGetParams).to.exist;
	});

	it('should throw error if input is not string', function(done) {
		try {
			parseURIGetParams()
		} catch (e) {
			done();
		}
	});

	it('should return object', function() {
		expect(tinyRes).to.be.an('object');
	});

	it('should extract get-params from url', function() {
		expect(parseURIGetParams('example.com/?test=true')['test']).to.equal('true');
	});

	it('returned object should contain the same keys as input search string', function() {
		expect(tinyRes).to.have.keys('parties');
		expect(res).to.have.keys(['parties', 'endYear', 'end', 'startYear', 'start']);
	});

	it('returned object should contain key value pairs', function() {
		expect(tinyRes['parties']).to.equal('mp');
		expect(res['endYear']).to.equal('');
		expect(res['end']).to.equal('');
		expect(res['startYear']).to.equal('');
		expect(res['start']).to.equal('');
	});

	it('should create array from +-values', function() {
		expect(res['parties']).to.eql(['s','v','mp']);
	});

	it('should concatenate array-values if key already exists', function() {
		expect(arrayRes['parties']).to.eql(['m', 'fp', 'kd', 'c', 's', 'v', 'mp', 'pp']);
	});
});