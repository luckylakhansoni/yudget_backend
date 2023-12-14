module.exports = (sequelize, DataTypes) => {
    const VatBill = sequelize.define("VatBill", {
        vat_invoice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:DataTypes.INTEGER,
        station_id: DataTypes.INTEGER,
        vat_amount: DataTypes.DECIMAL(10,2),
        vat_percent : DataTypes.DECIMAL(10,2),
        before_vat: DataTypes.DECIMAL(10,2),
        after_vat: DataTypes.DECIMAL(10,2),
        quantity: DataTypes.DECIMAL(10,2),
        invoiceId: DataTypes.STRING,
        start_date:DataTypes.DATE,
        end_date:DataTypes.DATE,
        prefix_id: DataTypes.STRING,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "vat_invoice",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
    VatBill.afterCreate( async (data, optionsObject) => {
        let invoiceId
        if(data.invoiceId) {
          invoiceId = data.invoiceId 
        } else {
            invoiceId = 100000000000
        }
        let obj =  {
            prefix_id : `VI${String(data.vat_invoice_id).padStart(8, '0')}`,
            invoiceId: parseInt(invoiceId) + parseInt(data.vat_invoice_id)
        }
        VatBill.update(obj, {where: {vat_invoice_id: data.vat_invoice_id}})
    })
   
    return VatBill;
  };