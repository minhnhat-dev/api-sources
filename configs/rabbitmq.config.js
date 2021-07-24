const { RABBITMQ_HOST } = process.env;

const rabbitmqConfig = {
    HOST: RABBITMQ_HOST || "localhost",
    PORT: "5672",
    USER: "consumer",
    PASS: "123456",
    dirname: "/var/log",
    CHANNEL_CONFIGS: [
        {
            QUEUE: "normal",
            EXCHANGE: "normal",
            PREFETCH: 10,
            PRIORITY: 10,
            MAX_RETRY_COUNT: 1,
            RETRY_COUNT_AFTER: 30000
        },
        {
            QUEUE: "normal02",
            EXCHANGE: "normal02",
            PREFETCH: 10,
            PRIORITY: 7,
            MAX_RETRY_COUNT: 1,
            RETRY_COUNT_AFTER: 30000
        },
        {
            QUEUE: "normal03",
            EXCHANGE: "normal03",
            PREFETCH: 10,
            PRIORITY: 5,
            MAX_RETRY_COUNT: 1,
            RETRY_COUNT_AFTER: 30000
        }
    ]
};

module.exports = rabbitmqConfig;
