'use strict';

let database = null;

module.exports ={
	database: (param) => database(param),
	setDatabase: (newDatabase) => database = newDatabase
};