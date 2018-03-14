'use strict';

const pg = require('../db/knex');
const Joi = require('joi');
const Boom = require('boom');

const routes = [
	{
		method: 'GET',
		path: '/users',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			users()
				.select('id', 'name', 'email', 'created_at', 'updated_at')
				.then((result) => {
					reply(result);
				});
		}
	},
	{
		method: 'GET',
		path: '/users/{id}',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			getUser(request.params.id)
				.then((result) => {
					reply(result[0]);
				});
		}
	},
	{
		method: 'PUT',
		path: '/users/{id}',
		config: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					name: Joi.string().required()
				})
			}
		},
		handler: function(request, reply) {
			users()
				.where({ id: request.params.id })
				.update({ name: request.payload.name })
				.then((result) => {
					getUser(request.params.id).then((result) => reply(result[0]));
				});
		}
	},
];

module.exports = {
	configure: (server) => {
		server.route(routes);
	},
};

const users = () => pg('users');

const getUser = (id) => {
	return users()
		.select('id', 'name', 'email', 'created_at', 'updated_at')
		.where({ id: id })
};
