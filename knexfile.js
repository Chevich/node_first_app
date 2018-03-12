module.exports = {
	client: 'pg',
		connection:	'postgres://postgres:postgres@localhost/node_test_app',
		searchPath:	['knex', 'public'],
};
