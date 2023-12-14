module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define("Contact", {
        contact_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false    
          },
        message:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: DataTypes.STRING,
        status: DataTypes.STRING 
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "contacts",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Contact;
  };