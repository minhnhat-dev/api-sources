/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* RabbitMQ */
const rp = require("request-promise");
const amqp = require("amqplib");
const rabbitMQConfig = require("../configs/rabbitmq.config");

const channels = [];
const { EXCHANGES } = rabbitMQConfig;

function parseMessageContent(msg) {
    return JSON.parse(msg.content.toString());
}

function enqueue(exchangeName, data, delay = null) {
    const { channel } = channels.find((c) => c.exchangeName === exchangeName);
    const channelConfig = CHANNEL_CONFIGS.find((c) => c.EXCHANGE === exchangeName);
    if (!channelConfig) {
        console.error(new Error("Error invalid channle"));
        process.exit(0);
    }

    const dataString = JSON.stringify(data);
    const content = new Buffer(dataString);
    const publishOptions = {
        // save message to disk
        persistent: true
    };

    if (delay) {
        publishOptions.headers = {
            "x-delay": delay
        };
    }

    channel.publish(channelConfig.EXCHANGE, "", content, publishOptions);
}

function messageHandler(msg = {}) {
    const { fields } = msg;
    const exchangeName = fields.exchange !== ""
        ? fields.exchange
        : fields.routingKey;
    console.log("exchangeName", exchangeName);
    const channelFound = channels.find((item) => item.exchangeName === exchangeName);
    const content = JSON.parse(msg.content.toString());

    if (content) {
        console.log("+ queue-dangerous");
        console.log(" [x] Data %s", content.msg.toString());
        channelFound.channel.ack(msg);
    }
}

async function connect() {
    try {
        console.log("rabbitMQConfig.HOST", rabbitMQConfig.HOST);
        console.log("rabbitMQConfig.PORT", rabbitMQConfig.PORT);
        const options = {
            hostname: rabbitMQConfig.HOST,
            port: rabbitMQConfig.PORT,
            username: rabbitMQConfig.USER,
            password: rabbitMQConfig.PASS
        };

        const connection = await amqp.connect(options);

        connection.on("error", (err) => {
            if (err.message !== "Connection closing") {
                console.error("CONNECTION ERROR: ", err);
            }
        });

        connection.on("close", () => {
            console.log("RECONNECTING");
            return setTimeout(connect, 10000);
        });

        console.log("Consumer connected");
        for (const channelConfig of EXCHANGES) {
            console.log("+ channelConfig: ", channelConfig);
            const { EXCHANGE_NAME, QUEUES, PREFETCH, PRIORITY } = channelConfig;
            const channel = await connection.createChannel();
            channels.push({
                exchangeName: channelConfig.EXCHANGE_NAME,
                channel
            });
            await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
            channel.prefetch(PREFETCH);

            for (const queue of QUEUES) {
                const consumeOptions = {
                    noAck: false,
                    priority: PRIORITY
                };
                const queueAsserted = await channel.assertQueue(queue, { durable: true });
                channel.bindQueue(queueAsserted.queue, EXCHANGE_NAME, queue);
                channel.consume(
                    channelConfig.QUEUE,
                    messageHandler,
                    consumeOptions
                );
            }
        }
    } catch (error) {
        console.error(error);
    }
}

connect();
