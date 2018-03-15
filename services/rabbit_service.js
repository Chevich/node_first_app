'use strict';

const amqp = require('amqplib/callback_api');

const sendMessage = (message) => {
	if (process.env.NODE_ENV === 'test') {
		return console.log(` [x] Sent "${message}" in TEST environment`);
	}
	amqp.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
			const q = 'hello';

			ch.assertQueue(q, { durable: false });
			// Note: on Node 6 Buffer.from(msg) should be used
			ch.sendToQueue(q, new Buffer.from(message));
			console.log(` [x] Sent "${message}"`);
		});
		setTimeout(() =>  conn.close(), 500);
	});
};

const messageReader = () => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}
	amqp.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
			const q = 'hello';

			ch.assertQueue(q, { durable: false });
			console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
			ch.consume(q, function(msg) {
				setTimeout(function() {
					console.log(" [x] Received %s", msg.content.toString());
				}, 5 * 1000);

			}, {noAck: true});
		});
	});
};

module.exports = {
	sendMessage: sendMessage,
	messageReader: messageReader,
};