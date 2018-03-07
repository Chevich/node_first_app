'use strict';

require('env2')('.env');

const Hapi = require('hapi');
const hapiAuthJWT = require('hapi-auth-jwt2');
const config = require('./config/config').configure;
const routes = require('./routes/config').configure;
const secret = 'secret';

const server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8080
});

config(server);

const validate = function(decoded, request, callback) {
	request.pg.client.query(`SELECT * FROM Users WHERE TOKEN='${decoded.token}'`, function(err, result) {
		return callback(null, !err && result && result.rows.length > 0);
	});
};

server.register(hapiAuthJWT, function(err) {
	if (err) {
		console.log(err);
	}

	server.auth.strategy('jwt', 'jwt',
		{
			key: secret,
			validateFunc: validate,
			verifyOptions: { algorithms: ['HS256'] }
		});

	server.auth.default('jwt');

	routes(server);
});

server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
