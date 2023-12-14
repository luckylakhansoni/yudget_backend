module.exports = (sequelize, DataTypes) => {
    const gas_company_summary = sequelize.define("gas_company_summary", {
        gas_company_summary_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        company_id:{
            type: DataTypes.INTEGER
        },
        company_name:DataTypes.STRING,
        created_at: DataTypes.STRING,
        station_count: DataTypes.DECIMAL(10,2),
        total_sell: DataTypes.DECIMAL(10,2),
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "gas_company_summarys",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return gas_company_summary;
  };