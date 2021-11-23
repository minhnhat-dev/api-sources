/* eslint-disable radix */
const fs = require("fs");
const path = require("path");

const { validateCreatePostNotify } = require("../validators/notifies.validator");
const { validateUser } = require("../validators/users.validator");
const { messagesServices, NotifiesServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createPostNotify(req, res, next) {
    const { body } = req;
    const data = await validateCreatePostNotify(body);
    const result = await NotifiesServices.createPostNotify(data);
    return res.status(201).send(result);
}

async function updatePostNotify(req, res, next) {
    const { id } = req.params;
    const newNotify = await NotifiesServices.updatePostNotify(id, req.body);
    return res.status(200).send(newNotify);
}

async function deletePostNotify(req, res, next) {
    const { id } = req.params;
    await NotifiesServices.deletePostNotify(id);
    return res.status(204).send();
}

async function getPostNotifies(req, res, next) {
    const { notifies, total } = await NotifiesServices.getListPostNotify(req.query);
    if (req.query.isAll) return res.status(200).send({ items: notifies, total });
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: notifies,
        total
    });
}

async function clearPostNotify(req, res, next) {
    await NotifiesServices.clearPostNotify(req.query);
    return res.status(200).send({ msg: "Clear notifies success." });
}

module.exports = {
    createPostNotify,
    getPostNotifies,
    deletePostNotify,
    updatePostNotify,
    clearPostNotify
};
