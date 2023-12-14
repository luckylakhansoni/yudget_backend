module.exports = (sequelize, DataTypes) => {
    const Bill = sequelize.define("Bill", {
        bill_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:DataTypes.INTEGER,
        fuel_credit: DataTypes.DECIMAL(10,2),
        fees: DataTypes.DECIMAL(10,2),
        total: DataTypes.DECIMAL(10,2),
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "bills",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Bill;
  };