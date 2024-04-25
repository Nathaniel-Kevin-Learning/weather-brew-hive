'use strict';
const { hashData } = require('../helpers/hash');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    let datas = require('../user.json');
    let refinedData = datas.map((data) => {
      let passwordHolder = data.password;
      data.oauth = false;
      data.password = hashData(passwordHolder);
      data.createdAt = data.updatedAt = new Date();
      return data;
    });
    await queryInterface.bulkInsert('Users', refinedData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    queryInterface.bulkDelete('Users', null, {});
  },
};
