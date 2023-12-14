module.exports = (sequelize, DataTypes) => {
    const companies_summary = sequelize.define("companies_summary", {
        companies_summary_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER
        },
        commission:DataTypes.DECIMAL(10,2),
        company_name: DataTypes.STRING, 
        created_at: DataTypes.STRING,
        car_count: DataTypes.STRING,
        branch_count: DataTypes.STRING,
        spend_money: DataTypes.STRING,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "companies_summarys",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });   
    return companies_summary;
  };