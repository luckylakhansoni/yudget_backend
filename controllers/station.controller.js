const helper = require("../utils/helper");
const Bcrypt = require("bcryptjs");
let db = require("../models/index");
const Op = db.Sequelize.Op;
const { REPORT_TYPE } = require("../utils/constant");
const { emailsend } = require("../utils/helper");
const support = require("../DOM/support.dom");
const branch = require("../DOM/branch.dom")
const transaction = require("../DOM/transaction.dom")
const car = require("../DOM/car.dom")
const station = require("../DOM/stationEmp.dom")
const defautlFee = require("../DOM/default_fee.dom")
const fuelPriceModel = require("../DOM/fuel_price.dom")
const userModel = require("../DOM/users.dom")
const userEmp = require("../DOM/emp.dom");
const mail = require("../utils/email");








exports.support = async (req, res) => {
  try {
    let id = req.userId;
    body = req.body;
    body.user_id = id;
    let returnData = await support.createRecord(body)
    let stationInfo = await station.singleRecord({
      where: {station_id: id, isActive: true}  
    })
    if(stationInfo.email){
      await mail.helpDesk(stationInfo)
    }
    res.send(returnData);
  } catch (error) {
    console.log(error);
    res.status(500).json(`Error, ${error}`);
  }
};

exports.passwordCheck = async (req, res) => {
  try {
    let id = req.userId;
    let body = req.body
    let query = {
      where: {
        station_id: id,
      },
    };
    let stationDetails = await station.singleRecord(query);
    if(!stationDetails) {
      res.send({message: {en: 'User not found', ar: 'المستخدم ليس موجود'}})
      return
    }
    let getAll = await station.findAllUsers({where: {email: stationDetails.email}});
    getAll = JSON.parse(JSON.stringify(getAll))  

    const verified = Bcrypt.compareSync(body.password, getAll[0].supervisor_password);
        
    if(verified) {
      res.send({message: {en: 'Password is correct', ar: 'كلمة المرور صحيحة'}})
      return
    } else  {
      res.status(400).send({message: {en: 'You have entered wrong password', ar: 'لقد أدخلت كلمة مرور خاطئة'}})
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.saleReports = async (req, res)=> {
  try {
    let id = req.userId
    let body = req.query
    if(!body.date) {
      res.status(400).json({message: {en: 'Please enter date', ar: 'الرجاء إدخال التاريخ'}});
      return
    } else if (!body.station_id) {
      res.status(400).json({message: {en: 'Station id required', ar: 'معرّف المحطة مطلوب'}});
      return 
    }
    let query = {}
    if(body.All === true || body.All === 'true') {
      let getStation = await station.singleRecord({where: {station_id: body.station_id, isActive: true}})
      if(!getStation) {
        res.status(400).json({message: {en: 'station does not exists', ar: 'المحطة غير موجودة'}})
      }
      let getAll  = await station.findAllUsers({where: {email: getStation.email, isActive: true},attributes: ['station_id','station_name']})
      getAll = JSON.parse(JSON.stringify(getAll))
      let arrayOfIds  = getAll.map(a=> a.station_id)
      query.where = {
        station_user_id: arrayOfIds
      }
    } else {
      query.where = {
        station_user_id : body.station_id
      }
    }
    let dateData = {
      [Op.gt]: body.date + ' 00:00:00',
      [Op.lt]: body.date + ' 23:59:59'
    }
    // query.where.station_user_id = body.station_id
    query.where.createdAt = dateData 
    // let query = {
    //   where: where,
    // }
    console.log(query)
    // process.exit()
    let transData = await transaction.findAlltransactions(query)
    let total =  transData.reduce(function(sum, current) { 
      return sum + parseFloat(current.fuel_amount);
    }, 0);
    let array3 = []
    for (let i = 0; i < transData.length; i++) {
      let query = {
        where: {
          car_plate: transData[i].car_plate
        },
        include: [{
          model: db.fuelPrice,
          as: 'fuelTypeDetails'
        }]
      }
      let carDetails  = await car.singleRecord(query)
      if(carDetails && carDetails.fuelTypeDetails && carDetails.fuelTypeDetails.fuel_type) {
        array3.push({
          amount: transData[i].fuel_amount,
          fuelType: carDetails.fuelTypeDetails.fuel_type,
        })
      }
    }
    let result = [];
    array3.reduce(function(res, value) {
      if (!res[value.fuelType]) {
        res[value.fuelType] = { fuelType: value.fuelType, amount: 0 };
        result.push(res[value.fuelType])
      }
      res[value.fuelType].amount += parseFloat(value.amount);
      return res;
    }, {});
    for (let k = 0; k < result.length; k++) {
      let percentage = await helper.percentage(total, result[k].amount)
      result[k].percentage = percentage 
    }
    let response = {
      total,
      data: result
    }
    res.send(response)
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.transaction = async (req, res)=> {
  try {
    let body = req.body
    console.log('body =>', body)
    if(body.amount < 0 || body.amount === 0) {
      res.status(400).json({message: 'Amount not valid'})
      return  
    }
    let carObj = await car.singleRecord({where: {car_plate: body.car_plate}, include: [{model: db.fuelPrice, as: 'fuelTypeDetails'}] })
    if(!carObj) {
      res.status(500).json({message: {en: 'Vehicle not found', ar: 'المركبة غير موجودة'}});
      return
    }
    carObj = JSON.parse(JSON.stringify(carObj))
    if(body.emp_code) {
      let findRecord = await userEmp.singleRecord({where: {emp_code: body.emp_code, user_id: carObj.user_id}})
      if(!findRecord) {
        res.status(400).json({message: {en: 'Employee does not exists', ar: 'الموظف غير موجود'}});
        return
      }
      if(findRecord && (findRecord.isActive === false || findRecord.isActive === 0)) {
        res.status(400).json({message: {en: 'Employee code is deactivated', ar: 'تم إلغاء تنشيط رمز الموظف'}});
        return 
      }
    }
    if(parseFloat(carObj.credit) < parseFloat(body.amount)) {
      res.status(400).json({message: {en: 'fuel amount should be less then from vehicle credit amount', ar: 'يجب أن تكون كمية الوقود أقل من مبلغ ائتمان السيارة'}});
      return
    }
    let getCarCount = await car.countRecord({where: {isActive: true, user_id: carObj.user_id}})
    if(!getCarCount) {
      res.status(400).json({message: {en: 'At Least add one vehicle', ar: 'أضف مركبة واحدة على الأقل'}});
      return
    }
    // defulat fee 
    let defaultFees = await defautlFee.findAllRecord({where: {isActive: true}})
    let fuelPrices = await fuelPriceModel.singleRecord({where: {isActive: true, fuel_price_id:carObj.fuelTypeDetails.fuel_price_id} })


    body.user_id = carObj.user_id
    body.station_user_id = req.userId
    body.fuel_amount = body.amount
    let leterAmount = parseFloat(body.amount)/fuelPrices.fuel_price 
    body.leter = leterAmount.toFixed(2) 
    body.price_per_leter = fuelPrices.fuel_price
    body.emp_code = body.emp_code
    body.fuel_id =  carObj.fuelTypeDetails.fuel_price_id
    let branchData = await branch.singleRecord({where:{branch_id: carObj.branch_id}})
    if(branchData) {
      body.branch_name = branchData.branch_name
      body.branch_id = carObj.branch_id

    }
    let packageCommision = await helper.getCommission(getCarCount)
    body.commission  = (body.amount) * parseFloat(packageCommision)/100
    body.balance = parseFloat(carObj.credit) - parseFloat(body.amount)
    body.vat  = (body.commission) * parseFloat(defaultFees[0].vat)/100
    body.credit = carObj.credit  
    let tra = await transaction.createRecord(body)
    if(tra) {
      await car.updateRecord({credit: body.balance }, {where: {car_id: carObj.car_id}})
      // find station emp  amount
      let stationEmp = await station.singleRecord({where: {station_id: req.userId}})
      if(stationEmp) {
       let creditAmount = parseFloat(stationEmp.credit) ? parseFloat(stationEmp.credit) : 0
       let calculate = creditAmount + parseFloat(body.amount)
       await station.updateRecord({credit: calculate}, {where: {station_id: req.userId}})
      }
      res.send({message: {
        en: 'Transaction was successfully done',
        ar: 'تمت المعاملة بنجاح'
      }})
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
}

exports.signin = async (req, res) => {
  try {
    let body = req.body;
    let user;
    console.log()
    if(!body.station_id) {
      res.status(400).json({message: {
        ar: 'الرجاء إدخال معرف محطة صالح!',
        en: 'Please enter valid station ID!' 
      }})
      return
    }
    if(!body.password) {
      res.status(400).json({message: {
        ar: 'أدخل كلمة مرور صالحة',
        en: 'Enter Valid Password' 
      }})
      return
    }
    // checking email registerd ot not
    let query = {
      where: {},
      include: [
        {
          model: db.gasCompany,
          as : "companyDetails"
        }
      ],
    }; 
    query.where.station_id = body.station_id
  
    user = await station.singleRecord(query);
    if (!user) {
      res.send({message: {en: 'User not found', ar: 'المستخدم ليس موجود'}})
      return;
    }
    if(user && (user.isActive === false || user.isActive === 0) ) {
      res.send({message: {en: 'Station is deactivated', ar: 'المحطة معطلة'}})
      return;   
    }
    const verified = Bcrypt.compareSync(body.password, user.password);
    if (verified) {
      let user_type = 'station_emp'
      let jwt = await helper.jwtToken(user.station_id, user_type);
      user = user.toJSON()
      user.token = `Bearer ${jwt}`
      let date = new Date()
      await station.updateRecord({last_login: date}, {where: {station_id: user.station_id}})
      res.send(user);
      return;
    } else {
      res.status(400).json({message: {en: 'You have entered wrong password', ar: 'لقد أدخلت كلمة مرور خاطئة'}})
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
    
  }
};

exports.logout = async(req, res) => {
  try {
    let date = new Date()
    await station.updateRecord({last_login: date}, {where: {station_id: req.userId}}) 
    res.send({message: {
      ar: 'تسجيل الخروج بنجاح',
      en: "logout successfully"
    } })
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}}); 
  }
}
exports.stationIds = async(req, res) => {
  try {
    let getStation = await station.singleRecord({where: {station_id: req.userId, isActive: true}})
    if(!getStation) {
      res.status(400).json({message: {en: 'station does not exists', ar: 'المحطة غير موجودة'}})
    }
    let getAll  = await station.findAllUsers({where: {email: getStation.email, isActive: true},attributes: ['station_id','station_name']})
    res.send(getAll)
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}}); 
  }
}