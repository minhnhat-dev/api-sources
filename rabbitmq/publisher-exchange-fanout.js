/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

// const msg = { message: "some message" };
console.log("process.argv", process.argv);
console.log("process.argv.slice(2).join(\" \")", process.argv.slice(2).join(" "));
const msg = process.argv.slice(2).join(" ") || "Hello World!";
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

        console.log("Consumer connected");
        const index = 0;
        const channelCongifsLength = rabbitMQConfig.CHANNEL_CONFIGS.length;
        const exchangeName = "logs";
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, "fanout", { durable: true });
        await channel.publish(exchangeName, "", Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

connect();
