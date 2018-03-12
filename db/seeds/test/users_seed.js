const Bcrypt = require('bcrypt');
exports.seed = function(knex, Promise) {
	return knex('users').del().then(() => {
		return [
			{
				name: 'andy',
				email: 'andy.chevich@gmail.com',
				password: 'andy123',
			},
			{
				name: 'another',
				email: 'example@gmail.com',
				password: 'example123',
			}
		]
	}).then(users => {
		return Promise.all(users.map(user => new Promise((resolve, reject) => {
			Bcrypt.hash(user.password, 10, function(err, hash) {
				if (err) {
					reject(err);
				}
				user.token = hash;
				delete user.password;
				resolve(user);
			});
		})));
	}).then(function(users) {
		return knex('users').insert(users);
	});
};

