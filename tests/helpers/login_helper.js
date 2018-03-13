'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.use(chaiHttp);

module.exports = {
	getTokenPromise: (email, password) => {
		return chai.request(server)
			.post('/login')
			.send({
				email: email,
				password: password
			})
			.then(res => res.body.token);
	}
};