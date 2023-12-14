module.exports = (sequelize, DataTypes) => {
    const invoice = sequelize.define("invoice", {
        invoice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:DataTypes.INTEGER,
        vat_percentage: DataTypes.DOUBLE(10,3),
        vat: DataTypes.DOUBLE(10,3),
        amount: DataTypes.DOUBLE(10,3),
        total: DataTypes.DOUBLE(10,3),
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        credit_consumed: DataTypes.DOUBLE(10,3),
        commission_percent: DataTypes.DOUBLE(10,3),
        commission_amount: DataTypes.DOUBLE(10,3),
        prefix_id: DataTypes.STRING,
        month: DataTypes.STRING,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "invoices",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
    invoice.afterCreate( async (data, optionsObject) => {
        let obj =  {
            prefix_id : `IN${String(data.invoice_id).padStart(8, '0')}`
        }
        invoice.update(obj, {where: {invoice_id:data.invoice_id}})
    })
   
    return invoice;
  };