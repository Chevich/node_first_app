const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');
const pg = require('../../db/knex');
const login_helper = require('../helpers/login_helper');

chai.use(chaiHttp);

describe('/Users route', function() {
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

	it('should return all users list', function(done) {
		login_helper.getTokenPromise('andy.chevich@gmail.com', 'andy123')
			.then(token => {
				return chai.request(server)
					.get('/users')
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(200);
						expect(res).to.be.json;
						expect(res.body).to.be.an('array');
						expect(res.body.length).to.equal(2);
						done();
					}).catch(function (err) {
						done(err);
					});
			});
	});
});