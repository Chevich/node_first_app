const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');
const pg = require('../../db/knex');
const login_helper = require('../helpers/login_helper');

chai.use(chaiHttp);

describe('/Sign route', function() {
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
				done();
			});
	});
});