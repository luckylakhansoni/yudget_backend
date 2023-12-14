module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      emp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      f_name: DataTypes.STRING,
      l_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
      },
      mobile: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      prefix_id: DataTypes.STRING,
      emp_code: DataTypes.STRING,   
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      deletedAt: "deletedAt",
      paranoid: true,
      tableName: "user_employee",
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  sequelize.sync({
    force: false,
    logging: false,
    alter: true
  });
  Employee.afterCreate( async (data, optionsObject) => {
    let emp_code
    if(data.emp_code) {
      emp_code = data.emp_code 
    } else {
      emp_code = 999
    }
    let obj =  {
        prefix_id : `EMP${String(data.emp_id).padStart(4, '0')}`,
        emp_code: parseInt(emp_code) + parseInt(data.emp_id)
    }
    Employee.update(obj, {where: {emp_id: data.emp_id}})
})

Employee.afterBulkCreate( async (data, optionsObject) => {
    
  data = JSON.parse(JSON.stringify(data))
  for (let i = 0; i < data.length; i++) {
    let emp_code
    if(data[i].emp_code) {
      emp_code = data[i].emp_code 
    } else {
      emp_code = 999
    }
    let obj =  {
        prefix_id : `EMP${String(data.emp_id).padStart(4, '0')}`,
        emp_code: parseInt(emp_code) + parseInt(data[i].emp_id)
    }
    Employee.update(obj, {where: {emp_id:data[i].emp_id}})
  }    
})

  return Employee;
};
