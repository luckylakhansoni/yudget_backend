module.exports = (sequelize, DataTypes) => {
    const Partner = sequelize.define("Partner", {
        partner_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        image_path:DataTypes.STRING,
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
        tableName: "partners",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Partner;
  };