module.exports = (sequelize, DataTypes) => {
    const FuelPrice = sequelize.define("FuelPrice", {
        fuel_price_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fuel_type: DataTypes.STRING,
        fuel_price: DataTypes.DECIMAL(10,2),
        vat: DataTypes.INTEGER,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "FuelPrices",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return FuelPrice;
  };