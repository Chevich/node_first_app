const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');

const login_fields = {
	email: Joi.string().email().required(), // Required
	password: Joi.string().required().min(6)   // minimum length 6 characters
};

let pg = null;

module.exports = {
	configure: (server) => {
		pg = server.pg;
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
	return pg('users').select('*').where({ email: request.payload.email }).then((result) => {
		if (result && result[0]) {
			const currentUser = result[0];
			Bcrypt.compare(request.payload.password, currentUser.token, function(err, isValid) {
				if (!err && isValid) {
					const object = { name: currentUser.name, token: currentUser.token };
					reply({ token: signJWT(object) });
				} else {
					reply(Boom.notFound('Sorry, that username or password is invalid, please try again.'));
				}
			});
		} else {
			throw new Error('error');
		}
	}).catch((err) => reply(Boom.notFound('Sorry, that password is invalid, please try again.')));
};

signJWT = (user) => {
	const object = { id: user.id, name: user.name, token: user.token };
	return JWT.sign(object, process.env.JWTSecret);
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
			pg('users').select('id', 'name', 'email', 'created_at', 'updated_at').then((result) => {
				reply(result);
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
	},
	{
		method: 'POST',
		path: '/sign',
		config: {
			auth: false,
			validate: {
				payload: Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required().min(6),
				})
			}
		},
		handler: function(request, reply) {
			return pg('users').select('*').where({ email: request.payload.email }).then((result) => {
				if (result && result[0]) {
					return reply(Boom.conflict('Sorry, that email is busy. Try to restore password instead of sign in.'));
				}
				Bcrypt.hash(request.payload.password, Number(process.env.saltRounds), function(err, hash) {
					if (err) {
						return reply(Boom.internal('Bcrypt error:', err.message));
					}
					pg('users').insert({ name: request.payload.email, token: hash }).then(result => {
						const object = { id: result.id, name: request.payload.email, token: hash };
						reply({ token: signJWT(object) });
					})
				});
			})
		}
	}
];


