module.exports = (sequelize, DataTypes) => {
  const defaultFee = sequelize.define(
    "defaultFee",
    {
      default_fee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vat: DataTypes.DECIMAL(10,2),
      commission: DataTypes.DECIMAL(10,2),
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
      tableName: "default_fees",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });

  return defaultFee;
};
