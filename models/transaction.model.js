module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {
        transaction_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        car_plate:DataTypes.STRING,
        user_id:DataTypes.INTEGER,
        branch_name: DataTypes.STRING,
        balance: DataTypes.DOUBLE(11, 3),
        credit : DataTypes.DOUBLE(11, 3),
        commission: DataTypes.DOUBLE(11, 3),
        station_user_id: DataTypes.INTEGER,
        fuel_amount : DataTypes.DOUBLE(11, 3),
        branch_id: DataTypes.INTEGER,
        price_per_leter: DataTypes.DOUBLE(11, 3),
        prefix_id: DataTypes.STRING,
        emp_code: DataTypes.STRING,
        fuel_id: DataTypes.INTEGER,
        leter : {
            type: DataTypes.DOUBLE(11, 3),
            default: null
        },
        vat: DataTypes.DOUBLE(11, 8),
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "transactions",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
    Transaction.afterCreate( async (transInstance, optionsObject) => {
        let obj =  {
            prefix_id : `TR${String(transInstance.transaction_id).padStart(10, '0')}`
        }
        Transaction.update(obj, {where: {transaction_id:transInstance.transaction_id}})
    })
   
    return Transaction;
  };