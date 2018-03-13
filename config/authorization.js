'use strict';

const controllers = require('../controllers/config').configure;
const hapiAuthJWT = require('hapi-auth-jwt2');

const pg = require('../db/knex');

module.exports = {
	configure: (server) => {
		server.register(hapiAuthJWT, function(err) {
			if (err) {
				console.log(err);
			}

			server.auth.strategy('jwt', 'jwt',
				{
					key: process.env.JWTSecret,
					validateFunc: validate,
					verifyOptions: { algorithms: ['HS256'] }
				});

			server.auth.default('jwt');

			controllers(server);
		});
	}
};

const validate = function(decoded, request, callback) {
	return pg('users').where({ token: decoded.token }).count().then((result) => {
		return callback(null, Number(result[0].count) === 1);
	});
};
