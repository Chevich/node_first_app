'use strict';

module.exports = {
	configure: (server) => {
		const database = require('./database');
		const pg = require('../db/knex');
		database.setDatabase(pg);
	}
};