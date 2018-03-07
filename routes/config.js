module.exports = {
	configure: (server) => {
		server.route(routes);
	},

};

routes = [
	{
		method: 'GET',
		path: '/',
		config: { auth: false },
		handler: function(request, reply) {
			reply('hello world');
		},
	},
	{
		method: 'GET',
		path: '/users',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			const q = 'SELECT * FROM Users';
			request.pg.client.query(q, function(err, result) {
				console.log(err, result.rows);
				reply(result.rows).header("Authorization", request.headers.authorization);;
			});
		}
	},
	{
		method: 'GET',
		path: '/restricted',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			reply({message: 'You used a Valid JWT Token to access /restricted endpoint!'})
				.header("Authorization", request.headers.authorization);
		}
	}
];


