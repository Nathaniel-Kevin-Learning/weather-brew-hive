let { Type } = require('../models');
class TypeController {
  static async getType(req, res, next) {
    try {
      let typeData = await Type.findAll({
        order: [['id', 'ASC']],
      });

      res.status(200).json(typeData);
    } catch (error) {
      next(error);
    }
  }

  static async postType(req, res, next) {
    try {
      let id = req.params.id;
      let newData = req.body;

      let newTypData = await Type.create({
        name: newData.name,
      });

      let NewTypeData = await Type.findByPk(newTypData.id);
      res.status(201).json(NewTypeData);
    } catch (error) {
      next(error);
    }
  }

  static async updateType(req, res, next) {
    try {
      let id = req.params.id;
      let newData = req.body;
      let typeCheck = await Type.findByPk(id);
      if (typeCheck === null || !typeCheck) {
        throw { name: 'missingData' };
      }
      await Type.update(
        {
          name: newData.name,
        },
        { where: { id } }
      );

      let NewTypeData = await Type.findByPk(id);
      res.status(200).json(NewTypeData);
    } catch (error) {
      next(error);
    }
  }

  static async deleteType(req, res, next) {
    try {
      let id = req.params.id;

      let targetData = await Type.findByPk(id);
      if (targetData === null || !targetData) {
        throw { name: 'missingData' };
      }
      let name = targetData.name;

      await targetData.destroy({ cascade: true });
      res
        .status(200)
        .json({ message: `Type ${name} has been successfully deleted` });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = TypeController;
