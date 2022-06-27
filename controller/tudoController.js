const db = require("../models");
const Helper = require('../config/helper')
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const { logger } = require("../logger/winston");


module.exports = {
    addTudo: async (req, res) => {
        try {
            const { title, description, published } = req.body;
            const data = await Tutorial.create({ title: title, description: description, published: published });
            const response = { data: data }
            return Helper.response(res, 200, "tudo created sucessfully!", response)

        } catch (error) {
            logger.error(error)
            return Helper.response(res, 500, "Internal server error")
        }

    },
    updateTudo: async (req, res) => {
        try {
            const id = req.params.id;
            const { title, description, published } = req.body;
            const data = await Tutorial.update({ title: title, description: description, published: published }, { where: { id: id } });
            console.log("data", data)
            if (data == 1) {
                const response = { data: data }
                return Helper.response(res, 200, "tudo updated sucessfully!", response)
            } else {
                return Helper.response(res, 400, `Tudo not found, Cannot update Tudo with id=${id}.`)
            }
        } catch (error) {
            logger.error(error)
            return Helper.response(res, 500, "Internal server error")
        }

    },
    tudoList: async (req, res) => {
        try {
            const title = req.query.title;
            var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const data = await Tutorial.findAll({ where: condition });
            if (data.length) {
                const response = { data: data }
                return Helper.response(res, 200, "Tudo list fetched sucessfully!", response)
            } else {
                return Helper.response(res, 400, "Tudo not found")
            }
        } catch (error) {
            logger.error(error)
            return Helper.response(res, 500, "Internal server error")
        }

    },
    tudoDetails: async (req, res) => {
        try {
            const id = req.params.id;
            const data = await Tutorial.findByPk(id);
            if (data) {
                const response = { data: data }
                return Helper.response(res, 200, "Tudo details fetched sucessfully!", response)
            } else {
                return Helper.response(res, 400, "Tudo not found")
            }
        } catch (error) {
            logger.error(error)
            return Helper.response(res, 500, "Internal server error")
        }

    },
    deleteTudo: async (req, res) => {
        try {
            const id = req.params.id;
            const data = await Tutorial.destroy({ where: { id: id } });
            if (data == 1) {
                const response = { data: data }
                return Helper.response(res, 200, "Tudo deleted sucessfully!", response)
            } else {
                return Helper.response(res, 400, "Tudo not found")
            }
        } catch (error) {
            logger.error(error)
            return Helper.response(res, 500, "Internal server error")
        }

    },
    findAllPublishedTudo: async (req, res) => {
        try {
            const data = await Tutorial.findAll({ where: { published: true } });
            if (data) {
                const response = { data: data }
                return Helper.response(res, 200, "Tudo list fetched sucessfully!", response)
            } else {
                return Helper.response(res, 400, "Tudo not found")
            }
        } catch (error) {
            logger.error(error)
            return Helper.response(res, 500, "Internal server error")
        }

    }
}