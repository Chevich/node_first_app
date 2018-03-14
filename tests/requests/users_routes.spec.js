const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');
const login_helper = require('../helpers/login_helper');

chai.use(chaiHttp);

describe('/Users route', function() {

	it('GET should return all users list', function(done) {
		login_helper.getTokenPromise('andy.chevich@gmail.com', 'andy123')
			.then(token => {
				chai.request(server)
					.get('/users')
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(200);
						expect(res).to.be.json;
						expect(res.body).to.be.an('array');
						expect(res.body.length).to.equal(2);
						done();
					}).catch(function(err) {
					done(err);
				});
			});
	});
});
