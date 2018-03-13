'use strict';

require('env2')(`.env.${process.env.NODE_ENV || 'test'}`);

console.log('Environment = ', process.env.NODE_ENV);
console.log('DB = ', process.env.DATABASE_URL);

const Hapi = require('hapi');
const authorize = require('./config/authorization').configure;

const server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8080
});

authorize(server);

server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server.listener ;
