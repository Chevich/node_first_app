const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');
const login_helper = require('../helpers/login_helper');

chai.use(chaiHttp);

describe('/Users/:id route', function() {

	it('GET should return the user', function(done) {
		login_helper.getTokenPromise('andy.chevich@gmail.com', 'andy123')
			.then(token => {
				chai.request(server)
					.get('/users/1')
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(200);
						expect(res).to.be.json;
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.property('id');
						expect(res.body).to.have.property('email');
						expect(res.body).to.have.property('name', 'andy');
						expect(res.body).to.have.property('updated_at');
						expect(res.body).to.have.property('created_at');
						expect(res.body).to.not.have.property('token');
						expect(res.body).to.not.have.property('password');
						done();
					}).catch(done);
			});
	});

	it('PUT should update and return the user', function(done) {
		login_helper.getTokenPromise('andy.chevich@gmail.com', 'andy123')
			.then(token => {
				chai.request(server)
					.put('/users/1')
					.set('Authorization', `Bearer ${token}`)
					.send({
						name: 'example'
					})
					.then(res => {
						expect(res).to.have.status(200);
						expect(res).to.be.json;
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.property('id');
						expect(res.body).to.have.property('name', 'example');
						expect(res.body).to.have.property('email');
						expect(res.body).to.have.property('updated_at');
						expect(res.body).to.have.property('created_at');
						expect(res.body).to.not.have.property('token');
						expect(res.body).to.not.have.property('password');

						done();
					}).catch(done);
			});
	});

	it('PUT should not update email', function(done) {
		login_helper.getTokenPromise('andy.chevich@gmail.com', 'andy123')
			.then(token => {
				chai.request(server)
					.put('/users/1')
					.set('Authorization', `Bearer ${token}`)
					.send({
						name: 'example',
						email: 'new@example.com',
						id: 123
					}).end((err, res) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.have.property('error');
					expect(res.body.error).to.eq('Bad Request');
					expect(res.body.validation.keys).to.include('email');
					expect(res.body.validation.keys).to.include('id');
					done();
				});
			});
	});

	it('DELETE should delete user', function(done) {
		login_helper.getTokenPromise('andy.chevich@gmail.com', 'andy123')
			.then(token => {
				chai.request(server)
					.delete('/users/1')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res).to.have.status(200);
						done();
					});
			});
	});
});
