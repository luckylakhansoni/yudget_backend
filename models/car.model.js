module.exports = (sequelize, DataTypes) => {
    const Car = sequelize.define("Car", {
        car_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        car_plate: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: 'car plate is already use!'
            }
        },
        fuel_type_id: {
            type: DataTypes.INTEGER,
        },        
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        branch_id: {
            type: DataTypes.INTEGER
         },
         car_type_id: DataTypes.INTEGER,
         year_id: DataTypes.INTEGER,
         brand_id: DataTypes.INTEGER,
         prefix_id:DataTypes.STRING,
        credit: {
            type: DataTypes.DECIMAL(10, 2)
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
         }
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "cars",
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
    Car.afterCreate( async (data, optionsObject) => {
        let obj =  {
            
            prefix_id : `VE${String(data.car_id).padStart(8, '0')}`
        }
        Car.update(obj, {where: {car_id:data.car_id}})
    })
    
  Car.afterBulkCreate( async (data, optionsObject) => {
    
    data = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < data.length; i++) {
      let obj =  {
        prefix_id : `VE${String(data[i].car_id).padStart(8, '0')}`
      }
       Car.update(obj, {where: {car_id:data[i].car_id}})
    }    
})
   
    return Car;
  };