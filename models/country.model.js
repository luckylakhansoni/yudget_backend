module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define("Country", {
        country_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "countries",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Country;
  };