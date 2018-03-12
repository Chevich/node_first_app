const Bcrypt = require('bcrypt');

const users = [
	{
		name: 'andy',
		email: 'andy.chevich@gmail.com',
		password: 'andy123',
	}, {
		name: 'another',
		email: 'example@gmail.com',
		password: 'example123',
	}

];

exports.up = function(knex, Promise) {
	const promises = Promise.all(users.map(user => new Promise((resolve, reject) => {
		Bcrypt.hash(user.password, 10, function(err, hash) {
			if (err) {
				reject(err);
			}
			user.token = hash;
			resolve(user);
		});
	}))).then((users) => {
		return users.map(user => {
			return promise = knex('users').insert({
				name: user.name,
				email: user.email,
				token: user.token
			});
		})
	});
	return Promise.all(promises);
};

exports.down = function(knex) {
	return knex('users')
		.del();
};
