module.exports ={
	configure: (server) => {
		server.pg = require('knex')({
			client: 'pg',
			connection: process.env.DATABASE_URL,
			searchPath: ['knex', 'public'],
		});
		console.log(server.pg);
	}
};