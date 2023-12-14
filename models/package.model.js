module.exports = (sequelize, DataTypes) => {
  const package = sequelize.define(
    "package",
    {
      package_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      package_name: DataTypes.STRING,
      max: DataTypes.STRING,
      min: DataTypes.STRING,
      fee: DataTypes.DECIMAL(10,2),

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      deletedAt: "deletedAt",
      paranoid: true,
      tableName: "packages",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });

  return package;
};
