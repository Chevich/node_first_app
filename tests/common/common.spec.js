const pg = require('../../db/knex');

beforeEach(function(done) {
	pg.migrate.rollback().then(function() {
		pg.migrate.latest().then(function() {
			pg.seed.run().then(function() {
				done();
			})
		})
	});
});

afterEach(function(done) {
	pg.migrate.rollback().then(function() {
		done();
	});
});