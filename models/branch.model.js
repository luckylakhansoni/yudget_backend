module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define("Branch", {
        branch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        branch_name: DataTypes.STRING,
        credit: DataTypes.DECIMAL(10,2),
        branch_manager: DataTypes.STRING,
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        city_id: DataTypes.STRING,
        district_id: DataTypes.STRING,
        prefix_id: DataTypes.STRING,
        otp: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: 'some is already use!'
            }
        },
        password: DataTypes.STRING,

        
        isAddCar:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
         },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         },
         remember_me: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "branches",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
    Branch.afterCreate( async (data, optionsObject) => {
        let obj =  {
            prefix_id : `BR${String(data.branch_id).padStart(5, '0')}`
        }
        Branch.update(obj, {where: {branch_id:data.branch_id}})
    })
   
    return Branch;
}