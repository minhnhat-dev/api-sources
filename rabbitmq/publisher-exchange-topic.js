/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

const args = process.argv.slice(2);
const key = args.length > 0 ? args[0] : "anonymous.info";
const msg = args.slice(1).join(" ") || "Hello World!";
const channels = [];
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
        /* keys  */
        console.log("Publisher connected");
        const exchangeName = "topic_logs";
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, "topic", { durable: true });

        console.log("msg", msg);
        console.log("key", key);
        channel.publish(exchangeName, key, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", key, msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

connect();
