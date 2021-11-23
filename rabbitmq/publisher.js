/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

async function connect() {
    try {
        const options = {
            hostname: rabbitMQConfig.HOST,
            port: rabbitMQConfig.PORT,
            username: rabbitMQConfig.USER,
            password: rabbitMQConfig.PASS
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

        const exchangeName = "exchange_logs";
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, "direct", { durable: true });
        const data = {
            exchangeName,
            msg: "Hello anh em"
        };
        const dataString = JSON.stringify(data);
        const content = new Buffer(dataString);
        await channel.publish(exchangeName, "normal", content);
        // ~/Desktop/source-code/kf_auto_formula
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

connect();
