module.exports = (sequelize, DataTypes) => {
    const Home = sequelize.define("Home", {
        home_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        car:DataTypes.STRING,
        city: DataTypes.STRING,
        station: DataTypes.STRING,
        monthly_transaction: DataTypes.DECIMAL(10,2),
        langauge_type: {
            type: DataTypes.STRING,
            defaultValue: 'EN'
          },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "homes",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Home;
  };