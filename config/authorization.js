const routes = require('../routes/config').configure;
const hapiAuthJWT = require('hapi-auth-jwt2');

const JWTSecret = 'secret';

module.exports = {
	configure: (server) => {
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
					key: JWTSecret,
					validateFunc: validate,
					verifyOptions: { algorithms: ['HS256'] }
				});

			server.auth.default('jwt');

			routes(server);
		});
	}
};