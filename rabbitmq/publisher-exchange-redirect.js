/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

const msg = process.argv.slice(2).join(" ") || "Hello World!";
const channels = [];
async function connect() {
    try {
        const options = {
            hostname: rabbitMQConfig.HOST,
            port: rabbitMQConfig.PORT
        };

        const connection = await amqp.connect(options);

        connection.on("error", err => {
            if (err.message !== "Connection closing") {
                logger.error("CONNECTION ERROR: ", err);
            }
        });

        connection.on("close", () => {
            logger.info("RECONNECTING");
            return setTimeout(connect, 10000);
        });

        console.log("Publisher connected");
        const exchangeName = "direct_logs";
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, "direct", { durable: true });

        const key = {
            error: "error",
            info: "info",
            dangerous: "dangerous"
        };

        console.log("msg", msg);
        console.log("key", key[msg]);
        channel.publish(exchangeName, key[msg], Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", key[msg], msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

connect();
