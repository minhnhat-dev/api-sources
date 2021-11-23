/* eslint-disable radix */
const fs = require("fs");
const path = require("path");

const { validateCreateConversation, validateConversation } = require("../validators/conversation.validator");
const { validateCreateBroad, validateUpdateBroad } = require("../validators/broads.validator");
const { conversationsServices, BroadsServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

class BroadsController {
    async getBroads(req, res) {
        const { broads, total } = await BroadsServices.getBroads(req.query);
        if (req.query.isAll) return res.status(200).send({ items: broads, total });
        return res.status(200).send({
            skip: req.query.skip || SKIP_DEFAULT,
            limit: req.query.limit || LIMIT_DEFAULT,
            items: broads,
            total
        });
    }

    async createBroad(req, res) {
        const { body } = req;
        const data = await validateCreateBroad(body);
        const broad = await BroadsServices.createBroad(data);
        return res.status(201).send(broad);
    }

    async updateBroad(req, res) {
        const { body } = req;
        const { id: broadId } = req.params;
        const data = await validateUpdateBroad(body);
        const newBroad = await BroadsServices.updateBroad({ id: broadId, data });
        return res.status(200).send(newBroad);
    }

    async deleteBroad(req, res) {
        const { id: broadId } = req.params;
        await BroadsServices.deleteBroad(broadId);
        return res.status(204).send();
    }
}

// async function getConversation(req, res, next) {
//     const { id } = req.params;
//     const conversation = await validateConversation(id);
//     return res.status(200).send(conversation);
// }

// async function checkConversationExists(req, res, next) {
//     const result = await conversationsServices.checkConversationExists(req.query);
//     return res.status(200).send(result);
// }

module.exports = new BroadsController();
