// const redis = require('redis');
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
// const { REDIS_PORT, REDIS_URL, SESSION_SECRET } = require('./configs');

// const redisClient = redis.createClient({
//     host: REDIS_URL,
//     port: REDIS_PORT
// });

// session({
//     store: new RedisStore({ client: redisClient }),
//     secret: SESSION_SECRET,
//     cookie: {
//         resave: false,
//         httpOnly: true,
//         secure: false,
//         saveUninitialized: false,
//         maxAge: 30000 // 30s
//     }
// });

// me kip redis
// const redis = require("redis")
// const { REDIS_PORT, REDIS_URL } = require("./config")

// const HOST = REDIS_URL || "localhost"
// const PORT = REDIS_PORT || 6379

// console.log("HOST", HOST)
// console.log("PORT", PORT)

// const redisClient = redis.createClient({
//     host: HOST,
//     port: PORT
// })

// redisClient.on("connect", () => {
//     console.log("📒 Redis is ready")
// })

// module.exports = redisClient
