'use strict';

const environment = process.env.NODE_ENV || 'development';
require('env2')(`.env.${environment}`);
console.log(`NODE env= ${environment}`);

const Hapi = require('hapi');
const authorize = require('./config/authorization').configure;

const server = new Hapi.Server();

server.connection({
	host: process.env.NODE_URL,
	port: process.env.NODE_PORT,
	routes: {
		cors: true,
		log: true
	}
});

authorize(server);

server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server.listener ;
