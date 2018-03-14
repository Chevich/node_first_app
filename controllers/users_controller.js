'use strict';

const pg = require('../db/knex');
const Joi = require('joi');
const Boom = require('boom');

const routes = [
	{
		method: 'GET',
		path: '/users',
		config: {
			description: 'Get all users',
			notes: 'Returns all users',
			auth: 'jwt',
			tags: ['api'],
			validate: {
				headers: Joi.object({
					authorization: Joi.string().required()
				}).options({ allowUnknown: true })
			}
		},
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
		config: {
			auth: 'jwt',
			tags: ['api'],
			description: 'Get user by ID',
			notes: 'Returns user\'s attributes',
			validate: {
				params: {
					id: Joi.number().required()
				},
				headers: Joi.object({
					authorization: Joi.string().required()
				}).options({ allowUnknown: true }),
			}
		},
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
			description: 'Updates user by ID',
			notes: 'Updates user\'s attributes and returns them',
			auth: 'jwt',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.number().required()
				},
				payload: Joi.object({
					name: Joi.string().required()
				}),
				headers: Joi.object({
					authorization: Joi.string().required()
				}).options({ allowUnknown: true }),
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
	{
		method: 'DELETE',
		path: '/users/{id}',
		config: {
			description: 'Deletes user by ID',
			notes: 'Deletes user\'s attributes and returns 200',
			auth: 'jwt',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.number().required()
				},
				headers: Joi.object({
					authorization: Joi.string().required()
				}).options({ allowUnknown: true }),
			}
		},
		handler: function(request, reply) {
			users()
				.where({ id: request.params.id }).del()
				.then((result) => {
					reply(result[0]);
				});
		}
	},
];

module.exports = {
	configure: (server) => {
		server.route(routes);
		return routes;
	},
	routes: () => routes,
};

const users = () => pg('users');

const getUser = (id) => {
	return users()
		.select('id', 'name', 'email', 'created_at', 'updated_at')
		.where({ id: id })
};
