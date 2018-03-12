'use strict';

const pg = require('../config/database').database;

const routes = [
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
];

module.exports = {
	configure: (server) => {
		server.route(routes);
	},
};
