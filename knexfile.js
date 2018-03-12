module.exports = {
	development: {
		client: 'pg',
		connection: 'postgres://postgres:postgres@localhost/first_node_app_development',
		migrations: {
			directory: __dirname + '/db/migrations'
		},
		seeds: {
			directory: __dirname + '/db/seeds/development'
		}
	},
	test: {
		client: 'pg',
		connection: 'postgres://postgres:postgres@localhost/first_node_app_test',
 		migrations: {
			directory: __dirname + '/db/migrations'
		},
		seeds: {
			directory: __dirname + '/db/seeds/test'
		}
	},
};



