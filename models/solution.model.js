module.exports = (sequelize, DataTypes) => {
    const Solution = sequelize.define("Solution", {
        solution_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:DataTypes.STRING,
        description: DataTypes.TEXT,
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
        tableName: "solutions",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return Solution;
  };