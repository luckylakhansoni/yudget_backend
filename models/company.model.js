const { COMPANY_TYPE } = require("../utils/constant");
module.exports = (sequelize, DataTypes) => {
  const Companys = sequelize.define(
    "Companys",
    {
      company_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      f_name: DataTypes.STRING,
      l_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
      mobile_no: DataTypes.STRING,
      company_name: DataTypes.STRING,
      company_phone_no: DataTypes.STRING,
      company_address: DataTypes.STRING,
      country_code: DataTypes.STRING,
      company_type: {
        type: DataTypes.ENUM(
          COMPANY_TYPE.car_company,
          COMPANY_TYPE.gas_company
        ),
      },
      company_reg_no: DataTypes.STRING,
      commercial_registration_number: DataTypes.STRING,
      vat_no: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      company_email: DataTypes.STRING,
      company_logo: DataTypes.STRING,
      vat_registration_certificate: DataTypes.STRING,
      profile_pic: DataTypes.STRING,
      bank_name: DataTypes.STRING,
      bank_account_iban: DataTypes.STRING,
      bank_account_letterhead: DataTypes.STRING,
      commercial_registration_certificate: DataTypes.STRING,
      payment_due: DataTypes.STRING,
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "companys",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });

  return Companys;
};
