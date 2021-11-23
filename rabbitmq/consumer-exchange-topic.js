/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

async function connect() {
    try {
        const options = {
            hostname: rabbitMQConfig.HOST,
            port: rabbitMQConfig.PORT
        };

        const connection = await amqp.connect(options);

        connection.on("error", (err) => {
            if (err.message !== "Connection closing") {
                console.log("CONNECTION ERROR: ", err);
            }
        });

        connection.on("close", () => {
            console.log("RECONNECTING");
            return setTimeout(connect, 10000);
        });

        console.log("Consumer connected");

        const exchangeName = "topic_logs";
        const channel = await connection.createChannel();
        /* dispatch a new message to a worker until it has processed */
        channel.prefetch(1);
        await channel.assertExchange(exchangeName, "topic", { durable: true });

        const queue = await channel.assertQueue("", { durable: true });
        const keys = ["*.error.*", "*.info.*", "*.dangerous.*", "improtant.#"];

        keys.forEach((key) => {
            channel.bindQueue(queue.queue, exchangeName, key);
        });

        channel.consume(
            queue.queue,
            (data) => {
                if (data.content) {
                    console.log("+ queue: ", queue.queue);
                    console.log("+ msg.fields.routingKey: ", data.fields.routingKey);
                    console.log(" [x] Data %s", data.content.toString());
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error(error);
    }
}

connect();
