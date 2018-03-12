'use strict';

module.exports = {
	configure: (server) => {
		const database = require('./database');
		const pg = require('knex')({
			client: 'pg',
			connection: process.env.DATABASE_URL,
			searchPath: ['knex', 'public'],
		});
		database.setDatabase(pg);
	}
};