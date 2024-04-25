const { comparePassword } = require('../helpers/hash');
const { createJWT } = require('../helpers/jwt');
let { User } = require('../models');
const { Op } = require('sequelize');
// let { jwtDecode } = require('jwt-decode');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

class UserController {
  static async register(req, res, next) {
    try {
      let data = req.body;
      let emailTarget = data.email;
      if (!data.email) {
        throw {
          name: 'invalidInput',
          message: 'email cannot be empty',
        };
      }
      if (!data.password) {
        throw {
          name: 'invalidInput',
          message: 'password cannot be empty',
        };
      }

      let findData = await User.findAll({
        where: {
          [Op.and]: [{ email: emailTarget }, { oauth: false }],
        },
      });

      if (findData.length != 0) {
        throw {
          name: 'invalidInput',
          message: 'Email already exist in the database',
        };
      }

      let findData2 = await User.findAll({
        where: {
          [Op.and]: [{ email: emailTarget }, { oauth: true }],
        },
      });

      if (findData2.length != 0) {
        if (findData2[0].role == 'Admin') {
          let savedUser = await User.create({
            email: data.email,
            password: data.password,
            role: 'Admin',
          });

          let { id } = savedUser;
          let dataBaru = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
          });
          res.status(201).json(dataBaru);
        } else {
          let savedUser = await User.create({
            email: data.email,
            password: data.password,
          });
          let id = savedUser.id;
          let dataBaru = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
          });
          res.status(201).json(dataBaru);
        }
      } else {
        let savedUser = await User.create({
          email: data.email,
          password: data.password,
        });
        let id = savedUser.id;
        let dataBaru = await User.findByPk(id, {
          attributes: { exclude: ['password'] },
        });
        res.status(201).json(dataBaru);
      }
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      let data = req.body;
      let emailTarget = data.email;

      if (!data.email) {
        throw {
          name: 'invalidInput',
          message: 'email cannot be empty',
        };
      }
      if (!data.password) {
        throw {
          name: 'invalidInput',
          message: 'password cannot be empty',
        };
      }
      let findData = await User.findAll({
        where: {
          [Op.and]: [{ email: emailTarget }, { oauth: false }],
        },
      });

      if (!findData || findData.length == 0) {
        throw {
          name: 'validationError',
          message:
            'Email does not exist in the database please register first or use gmail login',
        };
      } else {
        let checkPassword = comparePassword(
          data.password,
          findData[0].dataValues.password
        );

        if (!checkPassword) {
          throw {
            name: 'validationError',
            message: 'error invalid email or password',
          };
        } else {
          let { id } = findData[0];
          let LoggedUser = { id };

          let token = createJWT(LoggedUser);
          res.status(200).json({ token: token, role: findData[0].role });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async loginOauth(req, res, next) {
    try {
      // let data = req.body.oauthToken;
      let data = req.headers.google_token;
      if (!data) {
        throw { name: 'invalidToken' };
      }

      let ticket = await client.verifyIdToken({
        idToken: data,
        audience: process.env.CLIENT_ID,
      });

      const realUserData = ticket.getPayload();

      let emailTarget = realUserData.email;
      let findData = await User.findAll({
        where: {
          [Op.and]: [{ email: emailTarget }, { oauth: true }],
        },
      });
      if (findData.length != 0) {
        let { id } = findData[0];
        let LoggedUser = { id };

        let token = createJWT(LoggedUser);
        res.status(200).json({ token: token, role: findData[0].role });
      } else {
        let findData2 = await User.findAll({
          where: {
            [Op.and]: [{ email: emailTarget }, { oauth: false }],
          },
        });

        if (findData2.length != 0) {
          if (findData2[0].role == 'Admin') {
            let savedUser = await User.create({
              email: realUserData.email,
              oauth: true,
              role: 'Admin',
            });

            let { id } = savedUser;
            let LoggedUser = { id };
            let token = createJWT(LoggedUser);
            res.status(200).json({ token: token, role: savedUser.role });
          } else {
            let savedUser = await User.create({
              email: realUserData.email,
              oauth: true,
            });

            let { id } = savedUser;
            let LoggedUser = { id };
            let token = createJWT(LoggedUser);
            res.status(200).json({ token: token, role: savedUser.role });
          }
        } else {
          let savedUser = await User.create({
            email: realUserData.email,
            oauth: true,
          });

          let { id } = savedUser;
          let LoggedUser = { id };
          let token = createJWT(LoggedUser);
          res.status(200).json({ token: token, role: savedUser.role });
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
