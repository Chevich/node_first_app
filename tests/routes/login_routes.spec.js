const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');
const pg = require('../../db/knex');

chai.use(chaiHttp);

describe('/Login route', function() {
	beforeEach(function(done) {
		pg.migrate.rollback().then(function() {
			pg.migrate.latest().then(function() {
				pg.seed.run().then(function() {
					done();
				})
			})
		});
	});

	afterEach(function(done) {
		pg.migrate.rollback().then(function() {
			done();
		});
	});

	it('should login the user and return the token', function(done) {
		chai.request(server)
			.post('/login')
			.send({
				email: 'andy.chevich@gmail.com',
				password: 'andy123'
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.have.property('token');
				done();
			});
	});

	it('should NOT login the user with wrong password', function(done) {
		chai.request(server)
			.post('/login')
			.send({
				email: 'andy.chevich@gmail.com',
				password: '123123123'
			})
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error');
				expect(res.body).not.to.have.property('token');
				expect(res.body.error).to.eq('Not Found');
				done();
			});
	});
});