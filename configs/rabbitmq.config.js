const { RABBITMQ_HOST } = process.env;

const rabbitmqConfig = {
    HOST: RABBITMQ_HOST || "localhost",
    PORT: "5672",
    USER: "admin",
    PASS: "admin",
    dirname: "/var/log",
    EXCHANGES: [
        {
            EXCHANGE_NAME: "exchange_logs",
            PREFETCH: 10,
            MAX_RETRY_COUNT: 1,
            RETRY_COUNT_AFTER: 30000,
            QUEUES: [
                "warning",
                "normal",
                "dangerous"
            ]
        },
        {
            EXCHANGE_NAME: "exchange_message",
            PREFETCH: 10,
            MAX_RETRY_COUNT: 1,
            RETRY_COUNT_AFTER: 30000,
            QUEUES: [
                "webhook",
                "sync_data",
                "update_data"
            ]
        }
    ]
};

module.exports = rabbitmqConfig;
