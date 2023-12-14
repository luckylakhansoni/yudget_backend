const constant = require("../utils/constant");



module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
        image_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        path: DataTypes.STRING,
        image_for: {
            type:DataTypes.ENUM(constant.IMAGE_FOR.solution, constant.IMAGE_FOR.company)
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "images",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Image;
  };