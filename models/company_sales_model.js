module.exports = (sequelize, DataTypes) => {
    const company_sale = sequelize.define("company_sale", {
        company_sale_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        transaction_id:{
            type: DataTypes.INTEGER
        },
        car_plate:DataTypes.STRING,
        created_at: DataTypes.STRING,
        balance: DataTypes.STRING,
        credit: DataTypes.STRING,
        commission: DataTypes.STRING,
        station_user_id: DataTypes.INTEGER,
        branch_id: DataTypes.INTEGER,
        price_per_leter: DataTypes.STRING,
        prefix_id: DataTypes.STRING,
        emp_code: DataTypes.STRING,
        leter:DataTypes.STRING,
        vat:DataTypes.STRING,
        company_name: DataTypes.STRING,
        city_name: DataTypes.STRING,
        deistrict_name: DataTypes.STRING,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "company_sales",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return company_sale;
  };