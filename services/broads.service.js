/* eslint-disable radix */
const { Broads } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

class BroadsService {
    async getBroads(query) {
        const { skip = SKIP_DEFAULT, limit = LIMIT_DEFAULT, sort, select, searchText, isAll = false, userId } = query;
        const conditions = {};
        const selects = convertSelectQuery(select);
        const sortObject = buildSortStringToObject(sort);

        if (searchText) {
            conditions.$or = [{ name: { $regex: searchText.trim(), $options: "i" } }];
        }

        if (userId) {
            conditions.userId = userId;
        }

        const [broads = [], total = 0] = await Promise.all([
            Broads.find(conditions)
                .sort(sortObject)
                .skip(isAll ? 0 : Number(skip))
                .limit(isAll ? 0 : Number(limit))
                .select(selects)
                .lean(),
            Broads.countDocuments(conditions)
        ]);

        return { broads, total };
    }

    async createBroad(data) {
        const broad = await Broads.create(data);
        return broad;
    }

    async updateBroad({ id, data }) {
        const newBroad = await Broads.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
        return newBroad;
    }

    async deleteBroad(id) {
        return Broads.deleteOne({ _id: id });
    }
}

module.exports = new BroadsService();
