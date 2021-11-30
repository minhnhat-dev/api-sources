/* eslint-disable radix */
const _ = require("lodash");
const { Messages, Users } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { STATUS } = require("../constants/messages.constant");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createMessage(data) {
    const message = await Messages.create(data);
    return message;
}

async function getListMessages(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        conversationId,
        status
    } = query;
    const conditions = { status: STATUS.ACTIVE };
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { text: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (conversationId) {
        conditions.conversation = conversationId;
    }

    if (status) {
        conditions.status = status;
    }

    const [messages = [], total = 0] = await Promise.all([
        Messages.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .select(selects)
            .lean(),
        Messages.countDocuments(conditions)
    ]);

    return { messages, total };
}
module.exports = {
    createMessage,
    getListMessages
};
