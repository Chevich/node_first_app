'use strict';

const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[environment];

console.log(`DB env= ${environment}`);

module.exports = require('knex')(config);