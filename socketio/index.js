const socketServer = require("socket.io");
const redis = require("redis");
const redisAdapter = require("socket.io-redis");
const { REDIS_PORT, REDIS_URL, SESSION_SECRET } = require("../datasources/redis/configs");
const { handleChatSocketIO } = require("./chat.socketio");
const { globaltSocketIO } = require("./global.socketio");

function startSocketioServer(server) {
    const io = socketServer(server, {
        path: "/api/v1/socketio",
        allowEIO3: true,
        cors: {
            origin: "http://facebook-clone-minhnhatdev.surge.sh",
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Authorization"]
        }
    });

    const pubClient = redis.createClient({ host: REDIS_URL, port: REDIS_PORT });
    const subClient = pubClient.duplicate();
    io.adapter(redisAdapter({ pubClient, subClient }));
    handleChatSocketIO(io);
    globaltSocketIO(io);
    global.io = io;
    console.log("+ startSocketioServer() Socket.io Server running...");
}

function stopSocketioServer() {
    return new Promise((resolve, reject) => {
        io.close((error) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
}

module.exports = {
    startSocketioServer,
    stopSocketioServer
};
