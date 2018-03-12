'use strict';

require('env2')(`.env.${process.env.NODE_ENV || 'test'}`);

console.log('Environment = ', process.env.NODE_ENV);
console.log('DB = ', process.env.DATABASE_URL);

const Hapi = require('hapi');
const config = require('./config/config').configure;
const authorize = require('./config/authorization').configure;

const server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8080
});

config(server);
authorize(server);

server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
