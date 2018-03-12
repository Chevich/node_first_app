exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function (t) {
		t.increments('id').primary();
		t.string('name').notNullable();
		t.string('email').notNullable();
		t.string('token').notNullable();
		t.timestamps(false, true);
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('users')
};
