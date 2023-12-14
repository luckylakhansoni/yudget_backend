module.exports = (sequelize, DataTypes) => {
  const About = sequelize.define(
    "About",
    {
      about_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
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
      tableName: "abouts",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true,
  });

  return About;
};
