/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

// const msg = { message: "some message" };
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

        // for (index; index < channelCongifsLength; index += 1) {
        //     const channelConfig = rabbitMQConfig.CHANNEL_CONFIGS[index];
        //     const channel = await connection.createChannel();
        //     channels.push({
        //         exchangeName: channelConfig.EXCHANGE,
        //         channel
        //     });
        //     console.log("Created channel for queue: ", channelConfig.QUEUE);
        //     channel.prefetch(channelConfig.PREFETCH);
        // }

        const channel = await connection.createChannel();
        await channel.assertQueue("jobs", { durable: true });
        await channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)), { persistent: true });

        // await channel.close();
        // await connection.close();
    } catch (error) {
        console.error(error);
    }
}

connect();
