module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
        report_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        branch_id: DataTypes.INTEGER,
        user_id:DataTypes.INTEGER,
        branch_name: DataTypes.STRING,
        car_plate: DataTypes.STRING,
        amount: DataTypes.DECIMAL(10,2),
        fuel_type: DataTypes.STRING,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "reports",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Report;
}