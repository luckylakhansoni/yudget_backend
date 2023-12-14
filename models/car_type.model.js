module.exports = (sequelize, DataTypes) => {
  const carType = sequelize.define(
    "carType",
    {
      car_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      deletedAt: "deletedAt",
      paranoid: true,
      tableName: "car_types",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });

  return carType;
};
