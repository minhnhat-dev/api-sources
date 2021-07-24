/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

const msg = { message: "some message" };

const channels = [];
async function connect() {
    try {
        console.log("rabbitMQConfig.HOST", rabbitMQConfig.HOST);
        console.log("rabbitMQConfig.PORT", rabbitMQConfig.PORT);
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

        const channel = await connection.createChannel();
        await channel.assertQueue("jobs");

        channel.consume("jobs", (data) => {
            const secs = data.content.toString().split(".").length - 1;
            console.log(" [x] Received %s", data.content.toString());

            setTimeout(() => {
                console.log(" [x] Done");
            }, secs * 1000);
        }, { noAck: true });

        // await channel.close();
        // await connection.close();
    } catch (error) {
        console.error(error);
    }
}

connect();
