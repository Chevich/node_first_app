'use strict';

const LoginController = require('./login_controller');
const UsersController = require('./users_controller');

const routes = [
	{
		method: 'GET',
		path: '/',
		config: { auth: false },
		handler: function(request, reply) {
			reply('hello world');
		},
	},
];

module.exports = {
	configure: (server) => {
		server.route(routes);
		LoginController.configure(server);
		UsersController.configure(server);
	},
};
