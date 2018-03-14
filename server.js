'use strict';

const environment = process.env.NODE_ENV || 'development';

require('env2')(`.env.${environment}`);
console.log(`NODE env= ${environment}`);

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
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

server.register([
	Inert,
	Vision,
	{
		'register': HapiSwagger,
		'options': {
			info: {
				'title': 'Test API Documentation',
				'version': '0.0.1',
			}
		}
	}], (err) => {
	server.start((err) => {
		if (err) {
			console.log(err);
		} else {
			if (process.env.NODE_ENV !== 'test') {
				console.log('------ ROUTES -----------');
				server.table()[0].table.forEach((route) => console.log(`${route.method}\t${route.path}`));
				console.log('Server running at:', server.info.uri);
			}
		}
	});
});

module.exports = server.listener;
