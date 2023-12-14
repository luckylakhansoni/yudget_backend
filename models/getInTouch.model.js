module.exports = (sequelize, DataTypes) => {
  const getInTouch = sequelize.define(
    "getInTouch",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_address: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_no: DataTypes.STRING,
      alt_phone_no: DataTypes.STRING,
      link: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      deletedAt: "deletedAt",
      paranoid: true,
      tableName: "get_in_touch",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });

  return getInTouch;
};
