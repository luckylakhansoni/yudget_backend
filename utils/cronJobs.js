const cron = require("node-cron")
const moment = require('moment') 
let db = require("../models/index");
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize
const adminTransaction = require('../DOM/admin-transaction.dom')
const defaultFee = require('../DOM/default_fee.dom')
const invoice = require('../DOM/invoice.dom')
const carAndGas = require("../DOM/gas_company.dom");
const stationEmp = require("../DOM/stationEmp.dom");
const payment = require("../DOM/payment.dom");
const user = require("../DOM/users.dom")
const helper = require("../utils/helper")
const car = require('../DOM/car.dom') 
let { emailsend } = require("../utils/helper");
const transaction = require('../DOM/transaction.dom')
// const gasStationSale = require('../DOM/gas_station_sale.dom')
const mail =  require('../utils/email')
let  vatInvoice = require('../DOM/vat_invoice.dom')




// invoice
cron.schedule(
  "0 0 1 * *", //This will run the command foo at 1:00AM on the first of every month
  // '*/10 * * * *',
  async () => {
    try {
      const startOfMonth =  moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD hh:mm:ss');
      const endOfMonth   = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD hh:mm:ss');
      let start = moment(startOfMonth).startOf("day").format('YYYY-MM-DD')
      let end = moment(endOfMonth).endOf("day").format('YYYY-MM-DD')
      console
      let yearQuery = {
        where: {
          createdAt : {
            [Op.gt]: start + ' 00:00:00',
            [Op.lt]: end + ' 23:59:59'
          }       
        },     
        attributes: [
            [sequelize.fn('sum', sequelize.col('transfer_amount')), 'amount'],
            [sequelize.fn('sum', sequelize.col('vat')), 'vat_total'],
            [sequelize.fn('sum', sequelize.col('commision')), 'commision_total'],
            [sequelize.fn("concat", sequelize.literal(`MONTHNAME(createdAt)`)), 'month'],
            [sequelize.literal(`user_id`), "user_id"],
            [sequelize.literal(`transfer_amount`), "transfer_amount"],            
            [sequelize.literal(`MONTH(createdAt)`), "month_number"],
        ],
        group: ["user_id"],
    }
    let data = await adminTransaction.findAllRecords(yearQuery)
    data = JSON.parse(JSON.stringify(data))
    let defaultFeeData = await defaultFee.findAllRecord()
    defaultFeeData = JSON.parse(JSON.stringify(defaultFeeData))
    for (let i = 0; i < data.length; i++) {
  
      let getCarCount = await car.countRecord({where: {user_id: data[i].user_id}})
      getCarCount = JSON.parse(JSON.stringify(getCarCount))
      let userD = await user.singleRecord({where: {user_id: data[i].user_id}})
      if(userD && (userD.commission === null || userD.commission === 'null')){
        defaultFeeData[0].commission = await helper.getCommission(getCarCount)
      } else if(userD && (userD.commission === 0 || userD.commission === '0.00')){
        defaultFeeData[0].commission = await helper.getCommission(getCarCount)
      }else {
        defaultFeeData[0].commission = userD.commission
      }
      data[i].credit_consumed =  parseFloat(data[i].amount) - parseFloat(userD.credit)
  
      data[i].vat_percentage = defaultFeeData[0].vat
      data[i].commission_percent = defaultFeeData[0].commission
      data[i].commission_amount = (parseFloat(data[i].credit_consumed) * parseFloat(defaultFeeData[0].commission))/100
      data[i].vat = (parseFloat(data[i].credit_consumed) * parseFloat(defaultFeeData[0].vat))/100
      data[i].total = parseFloat(data[i].amount ) + parseFloat(data[i].vat)
      data[i].start_date = start + ' 00:00:00'
      data[i].end_date = end + ' 23:59:59'   
      let obj = await invoice.createRecord(data[i])
       if(obj){
        await mail.monthlyInvoice(userD, data[i].month, obj)
       }
    }
    console.log(`${data} successfully run the job`)
    } catch (e) {
      console.log({e})
      res.status(500).json({message : `Server Side Error ${e}`})
    }
  },
);



// vat invoice
cron.schedule(
  "0 0 1 * *",
  async ()=> {
    try {
      const startOfMonth =  moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD hh:mm:ss');
      const endOfMonth   = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD hh:mm:ss');
      let start = moment(startOfMonth).startOf("day").format('YYYY-MM-DD')
      let end = moment(endOfMonth).endOf("day").format('YYYY-MM-DD')
      console
      let yearQuery = {
        where: {
          createdAt : {
            [Op.gt]: start + ' 00:00:00',
            [Op.lt]: end + ' 23:59:59'
          }       
        },     
        attributes: [
            [sequelize.literal(`user_id`), "user_id"],
        ],
        group: ["user_id"],
    }
    let data = await transaction.findAlltransactions(yearQuery)
    data = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < data.length; i++) {
      let array = await transaction.findAlltransactions({where:{user_id: data[i].user_id}})
      array = JSON.parse(JSON.stringify(array))
      result = array.reduce(function (r, a) {
        r[a.station_user_id] = r[a.station_user_id] || [];
        r[a.station_user_id].push(a);
        return r;
      }, Object.create(null));
      
      Object.keys(result).forEach(async (key)=> {
        // console.log(key, result[key][0]);
        let defaultFeeData = await defaultFee.findAllRecord()
        defaultFeeData = JSON.parse(JSON.stringify(defaultFeeData))
        let beforeVat =  result[key].reduce(function(sum, current) { 
          return sum + parseInt(current.fuel_amount);
        }, 0);
        let totalLiter =  result[key].reduce((sum, item) => (sum + parseFloat(item.leter)), 0);
        let obj  = {
          user_id: result[key][0]['user_id'],
          station_id: result[key][0]['station_user_id'],
          before_vat: beforeVat,
          quantity: totalLiter,
          vat_percent: defaultFeeData[0].vat,
        }
        obj.vat_amount  =  (parseFloat(beforeVat) * parseFloat(defaultFeeData[0].vat))/100
        obj.after_vat = parseFloat(beforeVat)+parseFloat(obj.vat_amount)
        obj.start_date = start + ' 00:00:00',
        obj.end_date = end + ' 23:59:59'
        await vatInvoice.createRecord(obj)
      });
    }
    console.log(`${data} successfully run the job`)
    } catch (e) {
      console.log({e})
      res.status(500).json({message : `Server Side Error ${e}`})
    }
  }
)

cron.schedule(
  "0 1 * * *", 
  async () => {
    try {
      let data = await carAndGas.findAllGasCompany({where: {isActive: true}})
      if(data.length) {
        for (let i = 0; i < data.length; i++) {          
          if(data[i].payment_due === 'daily') {
            let sumOfStationCredit = await stationEmp.findAllUsers({
              where: {
                company_id: data[i].company_id 
              },
              attributes: [
                [sequelize.fn('sum', sequelize.col('credit')), 'creditSum'],
            ],
            })
            sumOfStationCredit = JSON.parse(JSON.stringify(sumOfStationCredit))
            let duDate = moment().format('YYYY-MM-DD')

            let object = {
              company_id: data[i].company_id,
              company_name: data[i].company_name,
              due_date: duDate,
              due_amount: sumOfStationCredit[0].creditSum,
              status :'open'
            }
            console.log(object, 'objectobject')
            if(parseFloat(object.due_amount)> 0) {
              let createData =  await payment.createRecord(object)
              if(createData) {
                await stationEmp.updateRecord({credit: 0},{ where: {
                  company_id: data[i].company_id 
                }})
              }
            }
          }
          const date = moment();
          const dayNumber = date.day();
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var index = days.indexOf(data[i].payment_due); // 1
          if(dayNumber === index) {
            let sumOfStationCredit = await stationEmp.findAllUsers({
              where: {
                company_id: data[i].company_id 
              },
              attributes: [
                [sequelize.fn('sum', sequelize.col('credit')), 'creditSum'],
            ],
            })
            sumOfStationCredit = JSON.parse(JSON.stringify(sumOfStationCredit))
            console.log(sumOfStationCredit, '!!!!!!!')
            let duDate = moment().format('YYYY-MM-DD')
            let object = {
              company_id: data[i].company_id,
              company_name: data[i].company_name,
              due_date: duDate,
              due_amount: sumOfStationCredit[0].creditSum,
              status :'open'
            }
            if(parseFloat(object.due_amount) > 0) {
              let createData = await payment.createRecord(object)
              if(createData) {
                await stationEmp.updateRecord({credit: 0},{ where: {
                  company_id: data[i].company_id 
                }})
              }
            }
          }          
        }
      }
    } catch (e) {
      console.log({e})
      res.status(500).json({message : `Server Side Error ${e}`})
    }
  },
);


// for gas station sale 
// cron.schedule(
//   "*/1 * * * *", 
//   async () => {
//     try {

//       let query = {
//         include: [
//           {
//             model: db.station_emp,
//             as: 'stationDetails',
//             attributes: ['station_id', 'company_id', 'station_name'],
//             include: [
//               {
//                 model: db.gasCompany,
//                 as: 'companyDetails',
//                 attributes: ['company_name', 'f_name', 'l_name'],
//               }         
//             ]
//           },
//           {
//             model: db.branch,
//             as: 'branchDetails',
//             attributes: ['branch_id', 'city_id', 'district_id', 'branch_name'],
//             include: [
//               {
//                 model: db.city,
//                 as: "cityData",
//                 attributes: ['city_id', 'name']
//               },
//               {
//                 model: db.district,
//                 as: "districtData",
//                 attributes: ['district_id', 'name']
  
//               },
//             ]
//           }, 
//           {
//             model: db.car,
//             as: 'carDetail',
//             attributes: ['car_id','car_plate', 'fuel_type_id'],
  
//             include: [
//               {
//                 model: db.fuelPrice,
//                 as: 'fuelTypeDetails',
//                 attributes: ['fuel_price_id','fuel_type'],
//               },   
  
//             ]
//           }
//         ],
//         // attributes: ['company_id','company_name', 'isActive', 'createdAt'],
//         // limit: body.limit,
//         // offset: body.offset,
//         order: [["transaction_id", "DESC"]],
//       }
//       let trans = await transaction.findAlltransactions(query)
//       // let count = await transaction.countRecord({where: where})
  
//       trans = JSON.parse(JSON.stringify(trans))

//       let array = []
//       for (let i = 0; i < trans.length; i++) {
//         let obj = {}
//         obj.transaction_id = trans[i].transaction_id
  
//         obj.prifix_id = trans[i].prifix_id ? trans[i].prifix_id : ''
//         if(trans[i] && trans[i].stationDetails && trans[i].stationDetails.companyDetails && trans[i].stationDetails.companyDetails.company_name) {
//           obj.company_name = trans[i].stationDetails.companyDetails.company_name  
//         }
//         if(trans[i] && trans[i].stationDetails && trans[i].stationDetails.station_name) {
//           obj.station_name = trans[i].stationDetails.station_name
  
//         }
//         if(trans[i] && trans[i].branchDetails && trans[i].branchDetails.cityData) {
//           obj.city = trans[i].branchDetails.cityData.name
  
//         }
//         if(trans[i] && trans[i].branchDetails && trans[i].branchDetails.districtData) {
//           obj.district = trans[i].branchDetails.districtData.name
//         }
//         if(trans[i] && trans[i].carDetail && trans[i].carDetail.fuelTypeDetails) {
//           obj.fuel_type = trans[i].carDetail.fuelTypeDetails.fuel_type
//         }
//         obj.amount = trans[i].fuel_amount
//         obj.created_at = trans[i].createdAt 
//         array.push(obj)
                  
//       }
//       console.log(JSON.stringify(array))
//       for (let i = 0; i < array.length; i++) {
//         let d = await gasStationSale.singleRecord({where: {transaction_id:array[i].transaction_id}})
//         console.log('Data', d)
//         if(d) {
          
//         } else {
//           await gasStationSale.createRecord(array[i])
//         }
//       }
//       //  console.log(array.length);
//       //  await gasStationSale.bulCreateRecord(array)
//        process.exit()
//       // let resp = {
//       //   data: array,
//       //   count
//       // }
//       // res.send(resp)
//     }  catch (e) {
//       console.log({e})
//       res.status(500).json({message : `Server Side Error ${e}`})
//     }
//   },
// );