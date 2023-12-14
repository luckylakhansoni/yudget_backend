module.exports = (sequelize, DataTypes) => {
    const Support = sequelize.define("Support", {
        support_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER
        },
        title:DataTypes.STRING,
        query: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "supports",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Support;
  };