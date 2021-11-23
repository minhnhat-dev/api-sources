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
                logger.error("CONNECTION ERROR: ", err);
            }
        });
        connection.on("close", () => {
            logger.info("RECONNECTING");
            return setTimeout(connect, 10000);
        });

        console.log("Consumer connected");

        const exchangeName = "logs";
        const channel = await connection.createChannel();
        /* dispatch a new message to a worker until it has processed */
        channel.prefetch(1);
        const queue = await channel.assertQueue("", { durable: true });
        console.log("queue", queue);
        channel.bindQueue(queue.queue, exchangeName, "");
        channel.consume(
            queue.queue,
            (data) => {
                if (data.content) {
                    console.log(" [x] %s", data.content.toString());
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error(error);
    }
}

connect();
