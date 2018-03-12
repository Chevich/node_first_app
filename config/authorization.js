const routes = require('../routes/config').configure;
const hapiAuthJWT = require('hapi-auth-jwt2');

module.exports = {
	configure: (server) => {
		const validate = function(decoded, request, callback) {
			return server.pg('users').where({ token: decoded.token }).count().then((result) => {
				return callback(null, Number(result[0].count) === 1);
			});
		};

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

			routes(server);
		});
	}
};