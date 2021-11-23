const usersControllers = require("./users.controller");
const postsControllers = require("./posts.controller");
const conversationsControllers = require("./conversations.controller");
const messagesControllers = require("./messages.controller");
const BroadsControllers = require("./broads.controller");
const NotifiesControllers = require("./notifies.controller");

module.exports = {
    usersControllers,
    postsControllers,
    conversationsControllers,
    messagesControllers,
    BroadsControllers,
    NotifiesControllers
};
