module.exports ={
	configure: (server) => {

		server.register({
			register: require('hapi-postgres-connection')
		}, function(err) {
			if (err) {
				console.error(err);
				throw err;
			}
		});
	}
};