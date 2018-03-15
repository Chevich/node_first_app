'use strict';

const amqp = require('amqplib/callback_api');

const sendMessage = (message) => {
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
	amqp.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
			const q = 'hello';

			ch.assertQueue(q, { durable: false });
			console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
			ch.consume(q, function(msg) {
				console.log(" [x] Received %s", msg.content.toString());
			}, {noAck: true});
		});
	});
};

module.exports = {
	sendMessage: sendMessage,
	messageReader: messageReader,
};