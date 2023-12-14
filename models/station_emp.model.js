module.exports = (sequelize, DataTypes) => {
  const stationEmp = sequelize.define(
    "stationEmp",
    {
      station_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      supervisor_name: DataTypes.STRING,
      supervisor_password: DataTypes.STRING,
      supervisor_password_plain: DataTypes.STRING,
      station_password_plain: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      station_name: DataTypes.STRING, 
      company_id: DataTypes.STRING,
      mobile_no: DataTypes.STRING,
      password: DataTypes.STRING,
      lat: DataTypes.DOUBLE(11, 8),
      long: DataTypes.DOUBLE(11, 8),
      credit: DataTypes.DECIMAL(10,2),
      last_login: DataTypes.DATE,
      fuel_type_id: DataTypes.STRING,  
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      deletedAt: "deletedAt",
      paranoid: true,
      tableName: "station_emp",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });
  return stationEmp;
};
