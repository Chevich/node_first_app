const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');

const login_fields = {
	email: Joi.string().email().required(), // Required
	password: Joi.string().required().min(6)   // minimum length 6 characters
};

let pg = null;

module.exports = {
	configure: (server) => {
		pg = server.pg;
		const opts = { fields: login_fields, handler: loginHandler, loginPath: '/login' };
		server.register([{ register: require('hapi-login'), options: opts }], function(err) {
			if (err) {
				console.error('Failed to load plugin:', err);
			}
		});

		server.route(routes);
	},
};

loginHandler = (request, reply) => {
	return pg('users').select('*').where({email: request.payload.email}).then((result) => {
		if (result && result[0]) {
			const currentUser = result[0];
			Bcrypt.compare(request.payload.password, currentUser.token, function(err, isValid) {
				if (!err && isValid) {
					const object = { id: currentUser.id, name: currentUser.name, token: currentUser.token };
					const token = JWT.sign(object, process.env.JWTSecret);
					reply({ token: token }).header("Authorization", request.headers.authorization); // return JWT token
				} else {
					reply(Boom.notFound('Sorry, that username or password is invalid, please try again.'));
				}
			});
		} else {
			throw new Error('error');
		}
	}).catch((err) => reply(Boom.notFound('Sorry, that password is invalid, please try again.')));
};


routes = [
	// {
	// 	method: 'GET',
	// 	path: '/',
	// 	config: { auth: false },
	// 	handler: function(request, reply) {
	// 		reply('hello world');
	// 	},
	// },
	// {
	// 	method: 'GET',
	// 	path: '/users',
	// 	config: { auth: 'jwt' },
	// 	handler: function(request, reply) {
	// 		const q = 'SELECT * FROM Users';
	// 		request.pg.client.query(q, function(err, result) {
	// 			console.log(err, result.rows);
	// 			reply(result.rows);
	// 		});
	// 	}
	// },
	{
		method: 'GET',
		path: '/restricted',
		config: { auth: 'jwt' },
		handler: function(request, reply) {
			reply({ message: 'You used a Valid JWT Token to access /restricted endpoint!' });
		}
	},
	// {
	// 	method: 'POST',
	// 	path: '/sign',
	// 	config: {
	// 		auth: false,
	// 		validate: {
	// 			payload: Joi.object({
	// 				email: Joi.string().email().required(),
	// 				password: Joi.string().required().min(6),
	// 				name: Joi.string().required(),
	// 			})
	// 		}
	// 	},
	// 	handler: function(request, reply) {
	// 		request.pg.client.query(`SELECT * FROM Users where email ilike ${request.payload.email}`, function(err, result) {
	// 			if (result.rows.length === 0) {
	// 				request.pg.client.query(`insert into users values ${request.payload.email}`, function(err, result) {
	// 					reply({})
	// 				});
	// 			}
	// 		});
	//
	// 	}
	// }
];


