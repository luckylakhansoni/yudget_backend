module.exports = (sequelize, DataTypes) => {
    const gas_station_sale = sequelize.define("gas_station_sale", {
        gas_station_sale_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        transaction_id:{
            type: DataTypes.INTEGER
        },
        company_name:DataTypes.STRING,
        created_at: DataTypes.STRING,
        station_name: DataTypes.STRING,
        city: DataTypes.STRING,
        district: DataTypes.STRING,
        fuel_type: DataTypes.STRING,
        amount: DataTypes.DECIMAL(10,2),
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "gas_station_sales",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return gas_station_sale;
  };