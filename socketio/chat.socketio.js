const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUsersOnline,
    getUsers
} = require("../services/user-socketio.service");

function handleChatSocketIO(io) {
    const chatNamespace = io.of("/v1/socketio/chat");

    chatNamespace.on("connection", (socket) => {
        console.log(`+ ${socket.id} is connnect....`);
        io.emit("welcome", "Welcome my connection");
        const socketId = socket.id;
        const { userId } = socket.handshake.query;
        console.log("userId", userId);
        if (!userId) {
            chatNamespace.to(socketId).emit("error", { error: "User Id is required !" });
            return;
        }

        socket.join(userId);
        /* check rooms */

        const input = { userId, socketId };
        addUser(input);
        const users = getUsers();
        console.log("+ connection() users", users);
        chatNamespace.to(userId).emit("getUsers", users);
        const { rooms } = chatNamespace.adapter;
        const { sids } = chatNamespace.adapter;
        console.log("rooms", rooms);
        console.log("sids", sids);

        socket.on("sendMessage", (data) => {
            const { receiver } = data;
            console.log("data", data);
            console.log("+ userId connected ", userId);
            chatNamespace.to(receiver.id).emit("getMessage", data);
        });

        socket.on("disconnect", () => {
            socket.leave(userId);
            removeUser(userId);
            console.log(`+ ${socket.id} is disconnect....`);
            console.log(`+ ${userId} is disconnect....`);
        });
    });
}

module.exports = {
    handleChatSocketIO
};
