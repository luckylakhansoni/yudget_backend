module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define("Price", {
        price_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        langauge_type: {
            type: DataTypes.STRING,
            defaultValue: 'EN'
          },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "Prices",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Price;
  };