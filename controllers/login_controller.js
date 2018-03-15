'use strict';

const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const pg = require('../db/knex');
const rabbit = require('../services/rabbit_service');

const login_fields = {
	email: Joi.string().email().required(), // Required
	password: Joi.string().required().min(6)   // minimum length 6 characters
};


const loginHandler = (request, reply) => {
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
const signJWT = (user) => {
	const object = { id: user.id, name: user.name, token: user.token };
	return JWT.sign(object, process.env.JWTSecret);
};

const routes = [
	{
		method: 'POST',
		path: '/sign',
		config: {
			tags: ['api'],
			auth: false,
			description: 'Signs in user to system',
			notes: 'Signs in user to system',
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
					pg('users').insert({ name: request.payload.email, email: request.payload.email, token: hash }).then(result => {
						const object = { id: result.id, name: request.payload.email, token: hash };
						rabbit.sendMessage(`New user ${request.payload.email} registered!`);
						reply({ token: signJWT(object) });
					})
				});
			})
		}
	}
];

module.exports = {
	configure: (server) => {
		const opts = { fields: login_fields, handler: loginHandler, loginPath: '/login' };
		server.register([{ register: require('hapi-login'), options: opts }], function(err) {
			if (err) {
				console.error('Failed to load plugin:', err);
			}
		});

		server.route(routes);
		return routes;
	},
	routes: () => routes,
};
