const { sendPostEmail } = require('../helpers/mailer');
const { Post, User, Type, sequelize } = require('../models');
const { Op } = require('sequelize');
class PostController {
  static async fetchPost(req, res, next) {
    try {
      let searchTarget = req.query.search;
      let sort = req.query.sort;
      let filter = req.query.filter;
      let pagination = req.query.page;

      const paramsQuerySQL = {};

      if (filter || searchTarget || sort || pagination) {
        if (searchTarget) {
          paramsQuerySQL.where = {
            title: { [Op.iLike]: `%${searchTarget}%` },
          };
        }
        if (filter) {
          paramsQuerySQL.where = {
            ...paramsQuerySQL.where,
            typeId: filter,
          };
        }
        if (sort) {
          let ordering;
          if (sort[0] === '-') {
            ordering = 'DESC';
          } else {
            ordering = 'ASC';
          }
          paramsQuerySQL.order = [[`createdAt`, `${ordering}`]];
        }
        if (pagination) {
          let limit = 10;
          let pageNumber = 1;

          if (pagination.size) {
            limit = pagination.size || 10;
            paramsQuerySQL.limit = limit;
          } else {
            paramsQuerySQL.limit = limit;
          }

          if (pagination.number) {
            pageNumber = pagination.number;
            paramsQuerySQL.offset = limit * (pageNumber - 1);
          }

          const { count, rows } = await Post.findAndCountAll(paramsQuerySQL);
          res.status(200).json({
            page: pageNumber,
            data: rows,
            totalData: count,
            totalPage: Math.ceil(count / limit),
            dataPerPage: limit,
          });
          return;
        }
        const { count, rows } = await Post.findAndCountAll(paramsQuerySQL);
        res.status(200).json({
          page: 1,
          data: rows,
          totalData: count,
          totalPage: 1,
          dataPerPage: count,
        });
      } else {
        let postData = await Post.findAll({
          include: [
            { model: User, attributes: ['email'] },
            { model: Type, attributes: ['name'] },
          ],
          order: [['id', 'ASC']],
        });

        res.status(200).json(postData);
      }
    } catch (error) {
      next(error);
    }
  }

  static async fetchPostById(req, res, next) {
    try {
      let id = req.params.id;
      let postDetailData = await Post.findByPk(id, {
        include: [
          { model: User, attributes: ['email'] },
          { model: Type, attributes: ['name'] },
        ],
      });
      if (!postDetailData || postDetailData == null) {
        throw { name: 'missingData' };
      }

      res.status(200).json(postDetailData);
    } catch (error) {
      next(error);
    }
  }

  static async postingPost(req, res, next) {
    try {
      let newData = req.body;
      let userId = req.user.id;

      let newPost = await Post.create({
        title: newData.title,
        shortDescription: newData.shortDescription,
        longDescription: newData.longDescription,
        imgUrl: newData.imgUrl,
        typeId: newData.typeId,
        userId,
      });

      const query = `SELECT DISTINCT ON (email) * FROM "Users";`;

      const results = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      let postDetailData = await Post.findByPk(newPost.id, {
        include: [
          { model: User, attributes: ['email'] },
          { model: Type, attributes: ['name'] },
        ],
      });
      sendPostEmail(results, postDetailData);
      res.status(201).json(postDetailData);
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req, res, next) {
    try {
      let id = req.params.id;
      let newData = req.body;

      await Post.update(
        {
          title: newData.title,
          shortDescription: newData.shortDescription,
          longDescription: newData.longDescription,
          imgUrl: newData.imgUrl,
          typeId: newData.typeId,
        },
        { where: { id } }
      );

      let NewTargetData = await Post.findByPk(id);

      res.status(200).json(NewTargetData);
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      let id = req.params.id;
      let targetData = await Post.findByPk(id);
      let title = targetData.title;
      await targetData.destroy();

      res
        .status(200)
        .json({ message: `${title} has been successfully being deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PostController;
