module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define("City", {
        city_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,

        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
         
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "cities",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return City;
  };