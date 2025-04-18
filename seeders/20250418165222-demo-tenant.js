'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tenants', [
      { name: 'BlogX', createdAt: new Date(), updatedAt: new Date() },
      { name: 'BlogY', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tenants', null, {});
  }
};
