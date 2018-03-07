const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');

const login_fields = {
	email: Joi.string().email().required(), // Required
	password: Joi.string().required().min(6)   // minimum length 6 characters
};

module.exports = {
	configure: (server) => {
		const opts = { fields: login_fields, handler: loginHandler, loginPath: '/login' };
		server.register([{ register: require('hapi-login'), options: opts }], function(err) {
			if (err) {
				console.error('Failed to load plugin:', err);
			}
		});

		server.route(routes);
	},
};

loginHandler = (request, reply) => {
	request.pg.client.query(`SELECT * FROM Users WHERE EMAIL ilike '${request.payload.email}'`, function(err, res) {
		if (err) {
			reply(Boom.notFound('Sorry, that password is invalid, please try again.'));
		}

		// Bcrypt.hash(request.payload.password, process.env.saltRounds, function(err, hash) {
		// 	console.log(hash, err);
		// });

		const currentUser = res.rows[0];
		Bcrypt.compare(request.payload.password, currentUser.token, function(err, isValid) {
			if (!err && isValid) {
				const object = { id: currentUser.id, name: currentUser.name, token: currentUser.token };
				const token = JWT.sign(object, process.env.JWTSecret);
				reply({ token: token }).header("Authorization", request.headers.authorization); // return JWT token
			} else {
				reply(Boom.notFound('Sorry, that username or password is invalid, please try again.'));
			}
		});
	});
};

routes = [
	{
		method: 'GET',
		path: '/',
		config: { auth: false },
		handler: function(request, reply) {
			reply('hello world');
		},
	},
	{
		method: 'GET',
		path: '/users',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			const q = 'SELECT * FROM Users';
			request.pg.client.query(q, function(err, result) {
				console.log(err, result.rows);
				reply(result.rows);
			});
		}
	},
	{
		method: 'GET',
		path: '/restricted',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			reply({ message: 'You used a Valid JWT Token to access /restricted endpoint!' });
		}
	}
];


