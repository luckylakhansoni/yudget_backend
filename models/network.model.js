module.exports = (sequelize, DataTypes) => {
    const Network = sequelize.define("Network", {
        network_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        company_id: DataTypes.INTEGER, 
        station_id: DataTypes.INTEGER,
        isActive:{  
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "networks",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Network;
};