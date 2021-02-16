const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      host: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("free", "premium"), // ENUM은 엄격하게 free나 premium 중에 하나만 들어갈 수 있다.
        allowNull: false
      },
      clientSecret: {
        type: Sequelize.UUID,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: "Domain",
      tableName: "domains"
    })
  }
  static associate(db) {
    db.Domain.belongsTo(db.User)
  }
}