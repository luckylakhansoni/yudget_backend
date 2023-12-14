module.exports = (sequelize, DataTypes) => {
    const adminTransaction = sequelize.define("adminTransaction", {
        transcation_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:DataTypes.INTEGER,
        transfer_amount: {
            type: DataTypes.DOUBLE(11, 3),
            default: 0.00 
        },
        fees: {
            type: DataTypes.DOUBLE(11, 3),
            default: 0.00 
        },
        commision: {
            type: DataTypes.DOUBLE(11, 3),
            default: 0.00 
        },
        vat: {
            type: DataTypes.DOUBLE(11, 3),
            default: 0.00 
        },
        actual_amount: {
            type: DataTypes.DOUBLE(11, 3),
            default: 0.00 
        },
        prefix_id: DataTypes.STRING,     
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "admin_transacions",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
    adminTransaction.afterCreate( async (data, optionsObject) => {
        let obj =  {
            prefix_id : `BI${String(data.transcation_id).padStart(8, '0')}`
        }
        adminTransaction.update(obj, {where: {transcation_id:data.transcation_id}})
    })
   
    return adminTransaction;
  };