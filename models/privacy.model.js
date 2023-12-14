module.exports = (sequelize, DataTypes) => {
  const Privacy = sequelize.define(
    "Privacy",
    {
      privacy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      path: DataTypes.STRING,
      langauge_type: {
        type: DataTypes.STRING,
        defaultValue: 'EN'
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      deletedAt: "deletedAt",
      paranoid: true,
      tableName: "privacies",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });

  return Privacy;
};
