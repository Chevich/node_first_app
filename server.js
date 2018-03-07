'use strict';

require('env2')('.env');

const Hapi = require('hapi');
const hapiAuthJWT = require('hapi-auth-jwt2');
const config = require('./config/config').configure;
const routes = require('./routes/config').configure;
const secret = 'sdfsdkfsdfsdjkfhsdjfhs';


const server = new Hapi.Server();


server.connection({
	host: 'localhost',
	port: 8080
});

config(server);


// bring your own validation function
const validate = function (decoded, request, callback) {
	console.log(" - - - - - - - decoded token:");
	console.log(decoded);
	console.log(" - - - - - - - request info:");
	console.log(request.info);
	console.log(" - - - - - - - user agent:");
	console.log(request.headers['user-agent']);

	// do your checks to see if the person is valid
	if (!people[decoded.id]) {
		return callback(null, false);
	}
	else {
		return callback(null, true);
	}
};

server.register(hapiAuthJWT, function (err) {
	if(err){
		console.log(err);
	}

	server.auth.strategy('jwt', 'jwt',
		{ key: secret,
			validateFunc: validate,            // validate function defined above
			verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
		});

	server.auth.default('jwt');

	routes(server);
});



server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
