const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');

chai.use(chaiHttp);

describe('/Sign route', function() {

	it('should add the user and return the token', function(done) {
		chai.request(server)
			.post('/sign')
			.send({
				email: 'new@example.com',
				password: '123123123'
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.have.property('token');
				done();
			});
	});

	it('should NOT add the user with existed email', function(done) {
		chai.request(server)
			.post('/sign')
			.send({
				email: 'andy.chevich@gmail.com',
				password: '123123123'
			})
			.end((err, res) => {
				expect(res).to.have.status(409);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.eq('Conflict');
				expect(res.body.message).to.eq('Sorry, that email is busy. Try to restore password instead of sign in.');
				done();
			});
	});

	it('should NOT add the user with WRONG email', function(done) {
		chai.request(server)
			.post('/sign')
			.send({
				email: 'new$example.com',
				password: '123123123'
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error');
				expect(res.body.error).to.eq('Bad Request');
				expect(res.body.validation.keys).to.include('email');
				done();
			});
	});
});