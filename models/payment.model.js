module.exports = (sequelize, DataTypes) => {
    const payment = sequelize.define("payment", {
        payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        company_id: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'close',
        },
        receipt: DataTypes.STRING,
        due_date: DataTypes.DATEONLY,
        due_amount: DataTypes.DOUBLE(11,3), 
        company_name: DataTypes.STRING,        

        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "payments",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return payment;
  };