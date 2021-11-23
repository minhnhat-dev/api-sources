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

        const exchangeName = "direct_logs";
        const channel = await connection.createChannel();
        /* dispatch a new message to a worker until it has processed */
        channel.prefetch(1);
        await channel.assertExchange(exchangeName, "direct", { durable: true });
        const queueNormal = await channel.assertQueue("queue-normal", { durable: true });
        const queueDangerous = await channel.assertQueue("queue-dangerous", { durable: true });
        console.log("queueNormal", queueNormal);
        console.log("queueDangerous", queueDangerous);
        const keys = ["error", "warning", "dangerous"];

        keys.forEach((key) => {
            if (key === "dangerous") {
                channel.bindQueue(queueDangerous.queue, exchangeName, key);
            } else {
                channel.bindQueue(queueNormal.queue, exchangeName, key);
            }
        });

        channel.consume(
            queueNormal.queue,
            (data) => {
                if (data.content) {
                    console.log("+ queue-normal");
                    console.log(" [x] Data %s", data.content.toString());
                }
            },
            { noAck: false }
        );

        channel.consume(
            queueDangerous.queue,
            (data) => {
                if (data.content) {
                    console.log("+ queue-dangerous");
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
