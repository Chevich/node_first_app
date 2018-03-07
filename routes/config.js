module.exports ={
	configure: (server) => {
		server.route({
			method: 'GET',
			path: '/',
			config: { auth: false },
			handler: function(request, reply) {
				return reply('hello world');
			},
		});

		server.route({
			method: 'GET',
			path: '/users',
			config: { auth: 'jwt' },
			handler: function(request, reply) {
				const q = 'SELECT * FROM Users';
				request.pg.client.query(q, function(err, result) {
					console.log(err, result.rows);
					return reply(result.rows);
				});
			}
		});
	}
};