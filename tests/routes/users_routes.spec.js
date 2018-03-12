const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');

chai.use(chaiHttp);

describe('API Routes', function() {
	it('should return root', function(done) {
		chai.request(server)
			.get('/')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
				//
				// res.should.have.status(200);
				// res.should.be.json; // jshint ignore:line
				// res.body.should.be.a('array');
				// res.body.length.should.equal(4);
				// res.body[0].should.have.property('name');
				// res.body[0].name.should.equal('Suits');
				// res.body[0].should.have.property('channel');
				// res.body[0].channel.should.equal('USA Network');
				// res.body[0].should.have.property('genre');
				// res.body[0].genre.should.equal('Drama');
				// res.body[0].should.have.property('rating');
				// res.body[0].rating.should.equal(3);
				// res.body[0].should.have.property('explicit');
				// res.body[0].explicit.should.equal(false);
				done();
			});
	});
});