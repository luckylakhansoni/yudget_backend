const fs = require('fs');
const moment =  require("moment")

const helper = require("../utils/helper");
const Bcrypt = require("bcryptjs");
let db = require("../models/index");
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize
const { USER_TYPE } = require("../utils/constant");
const {
  createRecord,
  singleRecord,
  updateRecord,
  activeUser,    
} = require("../DOM/users.dom");
const { fileUpload, csvUpload, fileUploadPdf } = require('../utils/helper')
const contactUs = require("../DOM/contactus.dom");
const branch = require("../DOM/branch.dom");
const car = require("../DOM/car.dom");
const transaction = require("../DOM/transaction.dom");
const solution = require("../DOM/solution.dom");
const company = require("../DOM/company.dom");
const image = require("../DOM/image.dom");
const constant = require("../utils/constant");
const partner = require("../DOM/partner.dom");
let { emailsend } = require("../utils/helper");
const report = require('../DOM/report.dom');
const bill = require('../DOM/bill.dom');
const network = require('../DOM/network.dom');
const year = require('../DOM/year.dom');
const brand = require('../DOM/brand.dom');
const carType = require('../DOM/carType.dom');
const adminTransaction = require('../DOM/admin-transaction.dom');
const package = require('../DOM/package.dom');
const home = require('../DOM/homepage.dom');
const stationEmp = require('../DOM/stationEmp.dom');
const defaultFee = require('../DOM/default_fee.dom');
const invoice = require('../DOM/invoice.dom');
const aboutUs = require('../DOM/about.dom')
const pricing = require('../DOM/price.dom')
const privacy = require('../DOM/privacy.dom')
const getInTouch = require('../DOM/getInTouch.dom')
const csv=require('csvtojson');
const fuelPrice = require('../DOM/fuel_price.dom');
let dbConfig = require('../config/db.config')
let userEmp = require('../DOM/emp.dom')
let districtModel = require('../DOM/district.dom');
let generator = require('generate-password');
let vatInvoice = require('../DOM/vat_invoice.dom');


const { user } = require('../models/index');
let password = generator.generate({
	length: 10,
	numbers: true
});
let  mail = require('../utils/email')







exports.register = async (req, res) => {
  try {
    let body = req.body;
    let query = {};
    query.where = {
      email: body.email,
    };
    let emailChecking = await singleRecord(query);
    let emailBranch = await branch.singleRecord(query);
    if (emailChecking || emailBranch) {
      res.status(400).json({message:{
        ar: 'البريد الإلكتروني مسجل مسبقا',
        en: "Email already registered" 
      }});
      return;
    }
    let plainPassword = body.password
    body.password = await helper.createPassword(body.password);
    let user = await createRecord(body);
    let jwt = await helper.jwtToken(user.user_id);
    res.setHeader("token", `Bearer ${jwt}`);
    user.jwtToken = jwt;
    user = user.toJSON();
    delete user.password;
    // sending email
    if(body.user_type === USER_TYPE.user) {
      await mail.signup(body.f_name, body.l_name, user, jwt, body.email, plainPassword)
    }
    res.send(user);
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.signin = async (req, res) => {
  try {
    let body = req.body;
    let user;
    // checking email registerd ot not
    let query = {
      where: {},
    };
    query.where.email = body.email
    query.user_type = body.user_type;
    user = await singleRecord(query);
    if (!user) {
      // for branch user 
      let brachObj = await branch.singleRecord({where: {email: body.email}})
      if(!brachObj) {
        res.status(400).json({message:{
          en: 'User not found',
          ar: 'المستخدم ليس موجود' 
        }});
        return;
      }
      brachObj = JSON.parse(JSON.stringify(brachObj))
      if(brachObj.isActive === false || brachObj.isActive === 0) {
          res.status(401).json({message: {en: 'Your account deactivated by admin', ar: 'تم إلغاء تنشيط حسابك من قبل المسؤول'}})
          return
      }   
      let type = 'branch_user'
      let jwtForBranch = await helper.jwtToken(brachObj.branch_id, type);
      res.setHeader("x-access-token", `Bearer ${jwtForBranch}`);
      const verified = Bcrypt.compareSync(body.password, brachObj.password);
      if(verified) {
        let userDetails = await singleRecord({where: {user_id: brachObj.user_id}})
        brachObj.isBranch = true
        delete brachObj.password
        brachObj.isApproved = userDetails.isApproved
        await branch.updateRecord({remember_me: body.remember_me}, {where: {user_id: brachObj.user_id}})
        res.send(brachObj)
        return;
      } else {
        res.status(400).json({message: {en:"Password does not match", ar:' كلمة السر غير متطابقة'}});
        return;
      }      
    }
    if(user.isActive === false || user.isActive === 0) {
      res.status(400).json({message: {en: "User is not active please contact admin", ar: 'تم إلغاء تنشيط حسابك من قبل المسؤول'}})
      return
    }
    let jwt = await helper.jwtToken(user.user_id);
    res.setHeader("x-access-token", `Bearer ${jwt}`);
    const verified = Bcrypt.compareSync(body.password, user.password);
    if (verified) {
      if(user.user_type === USER_TYPE.admin ){
        let resp = {
          l_name: user.l_name,
          f_name: user.f_name,
          contact_no: user.contact_no,
          email:user.email,
          isActive:user.isActive,
          user_type: user.user_type

        }
        res.send(resp);
        return;
      }
      user = JSON.parse(JSON.stringify(user))
      delete user.password
      let date = new Date()
      await updateRecord({last_login: date, remember_me: body.remember_me}, {where: {user_id: user.user_id}})
      res.send(user);
      return;
    } else {
      res.status(400).json({message: {en:"you have entered wrong password", ar: 'لقد أدخلت كلمة مرور خاطئة'}});
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
};
exports.forget = async (req, res) => {
  try {
    let body = req.body;
    let query = {
      where: {},
    };
    
      query.where.email = body.email;

    let userDetails = await singleRecord(query);
    if (!userDetails) {
      let branchEmail = await branch.singleRecord(query)
      if(branchEmail) {
        let randomNumber = await helper.createStationId();
        let newOtp = `${randomNumber}${branchEmail.branch_id}`;
        let queryObject = {
          where: { branch_id: branchEmail.branch_id },
        };
        let bodybject = {
          otp: newOtp,
        };
        // otp send in DB
        await branch.updateRecord(bodybject, queryObject);
        await mail.forget(newOtp, branchEmail.email);
        res.send({messgae: {en: "OTP sent your registered Email address", ar: 'أرسل OTP عنوان بريدك الإلكتروني المسجل'}});
        return
      } 
      res.status(400).json({message: {en: "Email not registered", ar:'البريد الإلكتروني غير مسجل'}});
      return
    }
    let randomNumber = await helper.createStationId();
    let newOtp = `${randomNumber}${userDetails.user_id}`;
    let queryObject = {
      where: { user_id: userDetails.user_id },
    };
    let bodybject = {
      otp: newOtp,
    };
    // otp send in DB
    await updateRecord(bodybject, queryObject);
    await mail.forget(newOtp, body.email);

    res.send({messgae: {en: "OTP sent your registered Email address", ar: 'أرسل OTP عنوان بريدك الإلكتروني المسجل'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};


exports.resetPassword = async (req, res) => {
  try {
    let body = req.body;
    let query = {
      where: {
        otp: body.otp,
      },
    };
    let user = await singleRecord(query);
    if (!user) {
      let branchObj = await branch.singleRecord(query) 
      if(branchObj) {
        let hashPassword = await helper.createPassword(body.password);
        let bodyObject = {
          password: hashPassword,
          otp: null,
        };
        let queryObject = {
          where: {
            branch_id: branchObj.branch_id,
          },
        };     
        await branch.updateRecord(bodyObject, queryObject);
        res.send({message :{en:"Password successfully changed", ar: 'الرقم السري تغير بنجاح'}});
        return;
      }
      res.status(400).json({message: {en: "Wrong otp entered", ar: 'دخلت otp خاطئ'}});
      return;
    }
    if (user) {
      let hashPassword = await helper.createPassword(body.password);
      let bodyObject = {
        password: hashPassword,
        otp: null,
      };
      let queryObject = {
        where: {
          user_id: user.user_id,
        },
      };     
      await updateRecord(bodyObject, queryObject);
      res.send({message :{en:"Password successfully changed", ar: 'الرقم السري تغير بنجاح'}});
      return;
    } else {
      res.status(400).json({message: {en: "Wrong otp entered", ar: 'دخلت otp خاطئ'}});
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
};

exports.changePassword = async (req, res) => {
    try {
        let id = req.userId
        let body = req.body
        let query = {
            where: {
                user_id: id
            }
        }
        let userDetail = await singleRecord(query)
        if(!userDetail) {
            res.status(400).json({message: {en:'User not exits', ar:'المستخدم غير متوفر'}})
            return
        }
        // checking password is match
        let convertedPassword  = await helper.createPassword(body.current_password);
        let newPassword  = await helper.createPassword(body.password);
       

        const verified = Bcrypt.compareSync(body.current_password, userDetail.password);
        if(verified) {
            let bodybject = {
                password :newPassword 
            }
            let query = {
                where: {
                    user_id : req.userId
                }
            }
            await updateRecord(bodybject, query)
            res.send({message: {en:'Your password has been successfully changed', ar: 'كلمة السر الخاصة بك تم تغييرها بنجاح'}})
            return
        } else {
            res.status(400).json({message: {en:`Current password is wrong`, ar: 'كلمة المرور الحالية خاطئة'}})
            return
        }
  }  catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
}

exports.gethomeData = async (req, res) => {
  try {
    let body = req.query;
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query = {
      where: {
        isActive: true,
      },
    };
    let query2 = {
      where: {
        image_for: constant.IMAGE_FOR.solution,
        isActive: true,
      },
      
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let responseData = await activeUser(query);
    let comp = await company.findAllcompany({where: {isActive: true}});
    let sol = await solution.findAllsolution({where: {isActive: true}});
    let solutionArray = await image.findAllcount(query2);
    let solutionCount = await image.recordCount({where: {isActive:true, image_for: constant.IMAGE_FOR.solution}});
    if (!solutionArray) {
      solutionArray.rows = [];
    }
    query2.where.image_for = constant.IMAGE_FOR.company;
    let companyArray = await image.findAllcount(query2);
    let companyCount = await image.recordCount({where:{isActive:true, image_for: constant.IMAGE_FOR.company}});

    let parnterImages = await partner.findAllParnter({where: {isActive: true}});
    let networkData = await network.findAllnetwork({where: {isActive: true}, include: [{
      model: db.gasCompany,
      as: 'gasStationDetails',
      attributes: ['company_name']
    },  {model: db.station_emp,
      as: 'stationEmpDetails',
      attributes: ['station_id','supervisor_name', 'lat', 'long', 'fuel_type_id']
    }],})
    networkData = JSON.parse(JSON.stringify(networkData))
    if (networkData.length) {
      for (let i = 0; i < networkData.length; i++) {
        let array = [] 
        if (networkData[i].stationEmpDetails && networkData[i].stationEmpDetails.fuel_type_id) {
          let arr = networkData[i].stationEmpDetails.fuel_type_id.split(',')
          for (let j = 0; j < arr.length; j++) {
            let fuel_typeData = await fuelPrice.singleRecord({where: {fuel_price_id: arr[j]}})
            if(fuel_typeData) {
              array.push(fuel_typeData) 
              networkData[i].stationEmpDetails.fuelTypes = array
            }    
          }
        }
      }
    }
    let packageData = await package.findAllRecord({where: {isActive: true}})
    let homeData = await home.findAllRecord({where: {isActive: true}})
    let stationEmpCount =  await stationEmp.recordCount({where: {isActive: true}})
    let city =  await branch.recordCount({where: {isActive: true,},attributes: [
      [sequelize.fn('count', sequelize.col('city_id')), 'count'],]})

    let todayDate = new Date()
    let inputeDate = new Date(todayDate);
    let firstDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth(), 1);
    let lastDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth() + 1, 0);
    let MonthlyAmountTransactionSum = {
      attributes: [
        [sequelize.fn('count', sequelize.col('transaction_id')), 'count'],
        [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],

      ],
      where: {
        createdAt : {
          [Op.gt]: firstDay.toISOString().slice(0, 10) + ' 00:00:00',
          [Op.lt]: lastDay.toISOString().slice(0, 10) + ' 23:59:59'
        }
      }
    }
    let monthlyTrans = await transaction.findAlltransactions(MonthlyAmountTransactionSum)
    monthlyTrans = JSON.parse(JSON.stringify(monthlyTrans))
    let carCount = await car.countRecord({where: {isActive: true}})
    
    let array = []
    let array2 = []
    let objForClient = {
      station : stationEmpCount,
      activeUser : responseData,
      coveredCity: city,
      monthlyTranscation: monthlyTrans,
      car: carCount
    }

    if(packageData.length) {
      for (let i = 0; i < packageData.length; i++) {
        if(packageData[i].min ||  packageData[i].max) {
          array.push(packageData[i].max)
          array.push(packageData[i].min)
        }
      }
      let min = Math.min(...array);
      let max = Math.max(...array);
      array2 = {
        max,
        min
      }
    }

    if (!companyArray) {
      companyArray.rows = [];
    }
    let resp = {
      actuveUser: responseData,
      couverdCity: homeData[0].city,
      fuelStation: homeData[0].station,
      monthlyTransaction: homeData[0].monthly_transaction,
      car: homeData[0].car,
      solutions: {
        solution: sol,
        company: comp,
      },
      partner: {
        solution: solutionArray.rows,
        company: companyArray.rows,
        total_solution_image: solutionCount,
        total_company: companyCount,
      },
      parnter_images: parnterImages,
      network:networkData,
      price: packageData,
      max_min: array2,
      forClient: objForClient,
      about_us: await aboutUs.findAllRecord({where: {isActive: true}}),
      pricingData: await pricing.findAllRecord({where: {isActive: true}}),
      privacyData: await privacy.findAllParnter({where: {isActive: true}}),
      getInTouchData: await getInTouch.findAllParnter({where: {isActive: true}}),
      currentMonthSum : monthlyTrans[0].sum

    };
    res.send(resp);
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.contactUs = async (req, res) => {
  try {
    let contactData = await contactUs.createRecord(req.body);
    if(contactData) {
      contactData = JSON.parse(JSON.stringify(contactData))
      await mail.Support(req.body.name, contactData.contact_id, req.body.email)
    }
    res.json({message: {en:'Data sucessfully saved', ar: 'تم حفظ البيانات بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
};

exports.userDashboard = async (req, res) => {
  try {
    let userId = req.userId;
    let body = req.query;
    if(!body.search_key) {
      body.search_key = ''
    }
    if(req.isBranch) {
      if(!body.search_key) {
        body.search_key = ''
      }
      body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
      body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
      let todayDate = new Date().toISOString().slice(0, 10);
      
  
      let query = {
        where: {
          branch_id: req.branch_id,
        },
        attributes: ['credit']
      };
      let query2 = {
        where: {
          [Op.or]: {
            car_plate: {
              [Op.like]: `%${body.search_key}%`,
            }
          },
          branch_id: req.branch_id,
          createdAt : {
            [Op.gt]: todayDate + ' 00:00:00',
            [Op.lt]: todayDate + ' 23:59:59'
          }
          
        },
        limit: body.limit,
        offset: body.offset,
        order: [["updatedAt", "DESC"]],
      }
  
      let month = {
        where: { branch_id: req.branch_id },
        
        attributes: [
            [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
            [sequelize.fn("concat", sequelize.literal(`MONTHNAME(createdAt)`)), 'month'],
            [sequelize.literal(`MONTH(createdAt)`), "month_number"],
        ],
        group: ['month'],
        order: [
            ["updatedAt", 'ASC']
        ]
    } 
  
      let branchCredit = await branch.singleRecord(query);
      query.limit = body.limit
      query.offset = body.offset
      let carCreditSum = await car.findAllcars({where: { user_id: req.branch_id },attributes:[[sequelize.fn('sum', sequelize.col('credit')), 'sum']]})
    carCreditSum = JSON.parse(JSON.stringify(carCreditSum))
    let totalCredit = parseFloat(branchCredit.credit) + parseFloat(carCreditSum[0].sum)

      let transactionData = await transaction.findAlltransactions(query2);
      let transactionCount = await transaction.countRecord(query2);
      let monthData = await transaction.findAlltransactions(month);
      let currentDate = new Date();
      let yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      let yesterDay = yesterday.toISOString().slice(0, 10);
      let yesterDaySum = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
        ],
        where: {
          createdAt : {
            [Op.gt]: yesterDay + ' 00:00:00',
            [Op.lt]: yesterDay + ' 23:59:59'
          },
          branch_id: req.branch_id
        }
      }
  
      let toDaySum = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
        ],
        where: {
          createdAt : {
            [Op.gt]: todayDate + ' 00:00:00',
            [Op.lt]: todayDate + ' 23:59:59'
          },
          branch_id: req.branch_id
        }
      }
      // query
      let inputeDate = new Date(todayDate);
      let firstDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth(), 1);
      let lastDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth() + 1, 0);
            
      
      let MonthlyAmountTransactionSum = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
        ],
        where: {
          createdAt : {
            [Op.gt]: firstDay.toISOString().slice(0, 10) + ' 00:00:00',
            [Op.lt]: lastDay.toISOString().slice(0, 10) + ' 23:59:59'
          },
          branch_id: req.branch_id
        },
      }
      let MonthlyCreditTransactionSum = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('credit')), 'sum'],
        ],
        where: {
          createdAt : {
            [Op.gt]: firstDay.toISOString().slice(0, 10) + ' 00:00:00',
            [Op.lt]: lastDay.toISOString().slice(0, 10) + ' 23:59:59'
          },
          branch_id: req.branch_id
        },
      }
      let feulAmountTotalOfMonth = await transaction.findAlltransactions(MonthlyAmountTransactionSum);
      let creditTotalOfMonth = await transaction.findAlltransactions(MonthlyCreditTransactionSum);
      feulAmountTotalOfMonth = JSON.parse(JSON.stringify(feulAmountTotalOfMonth))
      creditTotalOfMonth = JSON.parse(JSON.stringify(creditTotalOfMonth))
  
      let yesterDayTotal = await transaction.findAlltransactions(yesterDaySum);
      let toDayTotal = await transaction.findAlltransactions(toDaySum);
      yesterDayTotal = JSON.parse(JSON.stringify(yesterDayTotal))
      toDayTotal = JSON.parse(JSON.stringify(toDayTotal))
      let curr = new Date; // get current date
      let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      let last = first + 6; // last day is the first day + 6
  
      let firstdayWeek = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      let lastdayWeek = new Date(curr.setDate(last)).toISOString().slice(0, 10);
      let traverse = firstdayWeek
      let array = []
      for (let i = 0; i < 7; i++) {
        console.log('traverse ==> ',traverse)
        let weekQuery = {
          attributes: [
            [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
          ],
          where: {
            createdAt : {
              [Op.gt]: traverse + ' 00:00:00',
              [Op.lt]: traverse + ' 23:59:59'
            },
            branch_id: req.branch_id
          }
        }
        let weekTotal = await transaction.findAlltransactions(weekQuery);
        weekTotal = JSON.parse(JSON.stringify(weekTotal))
        array.push({amount: weekTotal[0].sum ? weekTotal[0].sum : 0, day: i})
        traverse = new Date(traverse);
        traverse = new Date(traverse.setDate(traverse.getDate() + 1 )).toISOString().slice(0, 10);
        console.log('traverse===>',traverse)
      }
      let resp = {
        availablecredit: branchCredit || 0,
        totalUsage: {
          today:  {
            percentage: await helper.percentage(yesterDayTotal[0].sum, toDayTotal[0].sum),
            value: toDayTotal[0].sum
          },
          month: {
           percentage: await helper.percentage(creditTotalOfMonth[0].sum, feulAmountTotalOfMonth[0].sum),
           value: feulAmountTotalOfMonth[0].sum
          }
        },
        transaction: transactionData || [],
        yearGraph: await helper.properGraph(monthData),
        weekly_reports: array,
        allTimeYearGraph: await helper.properGraph(monthData),
        transactionCount,
        privacyData: await privacy.findAllParnter({where: {isActive: true}}),
        getInTouchData: await getInTouch.findAllParnter({where: {isActive: true}}),
        totalCredit
      };
      res.send(resp);
      return
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let todayDate = new Date().toISOString().slice(0, 10);   

    let query = {
      where: {
        user_id: userId,
      },
      attributes: ['credit']
    };
    let query2 = {
      where: {
        [Op.or]: {
          car_plate: {
            [Op.like]: `%${body.search_key}%`,
          }
        },
        user_id: userId,
        createdAt : {
          [Op.gt]: todayDate + ' 00:00:00',
          [Op.lt]: todayDate + ' 23:59:59'
        }
        
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    }

    let month = {
      where: { user_id: req.userId },
      
      attributes: [
        [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
        [sequelize.fn("concat", sequelize.literal(`MONTHNAME(createdAt)`)), 'month'],
        [sequelize.literal(`MONTH(createdAt)`), "month_number"],
      ],
      group: ['month'],
      order: [
        ["updatedAt", 'ASC']
      ]
  }
    let creditData = await singleRecord(query);
    let carCreditSum = await car.findAllcars({where: { user_id: req.userId },attributes:[[sequelize.fn('sum', sequelize.col('credit')), 'sum']]})
    carCreditSum = JSON.parse(JSON.stringify(carCreditSum))
    let totalCredit = parseFloat(creditData.credit) + parseFloat(carCreditSum[0].sum)   
    query.limit = body.limit
    query.offset = body.offset
    let transactionData = await transaction.findAlltransactions(query2);
    let transactionCount = await transaction.countRecord(query2);

    let monthData = await transaction.findAlltransactions(month);
    let currentDate = new Date();
    let yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    let yesterDay = yesterday.toISOString().slice(0, 10);
    let yesterDaySum = {
      attributes: [
        [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
      ],
      where: {
        createdAt : {
          [Op.gt]: yesterDay + ' 00:00:00',
          [Op.lt]: yesterDay + ' 23:59:59'
        },
        user_id: req.userId
      }
    }

    let toDaySum = {
      attributes: [
        [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
      ],
      where: {
        createdAt : {
          [Op.gt]: todayDate + ' 00:00:00',
          [Op.lt]: todayDate + ' 23:59:59'
        },
        user_id: req.userId
      },
    }
    // query
    let inputeDate = new Date(todayDate);
    let firstDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth(), 1);
    let lastDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth() + 1, 0);
          
    
    let MonthlyAmountTransactionSum = {
      attributes: [
        [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
      ],
      where: {
        createdAt : {
          [Op.gt]: firstDay.toISOString().slice(0, 10) + ' 00:00:00',
          [Op.lt]: lastDay.toISOString().slice(0, 10) + ' 23:59:59'
        },
        user_id: req.userId
      },
    }
    let MonthlyCreditTransactionSum = {
      attributes: [
        [sequelize.fn('sum', sequelize.col('credit')), 'sum'],
      ],
      where: {
        createdAt : {
          [Op.gt]: firstDay.toISOString().slice(0, 10) + ' 00:00:00',
          [Op.lt]: lastDay.toISOString().slice(0, 10) + ' 23:59:59'
        },
        user_id: req.userId
      },
    }
    let feulAmountTotalOfMonth = await transaction.findAlltransactions(MonthlyAmountTransactionSum);
    let creditTotalOfMonth = await transaction.findAlltransactions(MonthlyCreditTransactionSum);
    feulAmountTotalOfMonth = JSON.parse(JSON.stringify(feulAmountTotalOfMonth))
    creditTotalOfMonth = JSON.parse(JSON.stringify(creditTotalOfMonth))

    let yesterDayTotal = await transaction.findAlltransactions(yesterDaySum);
    let toDayTotal = await transaction.findAlltransactions(toDaySum);
    console.log(yesterday)
    yesterDayTotal = JSON.parse(JSON.stringify(yesterDayTotal))
    toDayTotal = JSON.parse(JSON.stringify(toDayTotal))
    let curr = new Date; // get current date
    let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstdayWeek = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    let lastdayWeek = new Date(curr.setDate(last)).toISOString().slice(0, 10);
    let traverse = firstdayWeek
    let array = []
    for (let i = 0; i < 7; i++) {
      console.log('traverse ==> ',traverse)
      let weekQuery = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'],
        ],
        where: {
          createdAt : {
            [Op.gt]: traverse + ' 00:00:00',
            [Op.lt]: traverse + ' 23:59:59'
          },
          user_id: req.userId
        }
      }
      let weekTotal = await transaction.findAlltransactions(weekQuery);
      weekTotal = JSON.parse(JSON.stringify(weekTotal))
      array.push({amount: weekTotal[0].sum ? weekTotal[0].sum : 0, day: i})
      traverse = new Date(traverse);
      traverse = new Date(traverse.setDate(traverse.getDate() + 1 )).toISOString().slice(0, 10);
      console.log('traverse===>',traverse)
    }
    let resp = {
      availablecredit: creditData.credit || 0,
      totalUsage: {
        today:  {
          percentage: await helper.percentage(yesterDayTotal[0].sum, toDayTotal[0].sum),
          value: toDayTotal[0].sum
        },
        month: {
          percentage: await helper.percentage(creditTotalOfMonth[0].sum, feulAmountTotalOfMonth[0].sum),
          value: feulAmountTotalOfMonth[0].sum
        }
      },
      transaction: transactionData || [],
      yearGraph: await helper.properGraph(monthData),
      weekly_reports: array,
      allTimeYearGraph: await helper.properGraph(monthData),
      transactionCount,
      totalCredit,
      privacyData: await privacy.findAllParnter({where: {isActive: true}}),
      getInTouchData: await getInTouch.findAllParnter({where: {isActive: true}}),
    };
    res.send(resp);
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.addBranch = async (req, res) => {
  try {
    req.body.user_id = req.userId;
    let getBranch = await branch.singleRecord({where: {email: req.body.email}})
    let getUser = await singleRecord({where: {email: req.body.email}})
    if(getBranch || getUser) {
      res.status(400).json({message:{ en:"Email already exists", ar: 'البريد الالكتروني موجود بالفعل'}})
      return;
    }
    let beforePassword  =  password
    req.body.password = password 
    if(req.body.password) {
      req.body.password = await helper.createPassword(req.body.password);
    }
    let branchObject = await branch.createRecord(req.body);
    if(branchObject) {
      await mail.newBranch(req.body.branch_manager, req.body.branch_name, req.body.email, beforePassword)
    }
    res.send(branchObject);
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.bracnhes = async (req, res) => {
  try {
    let body =  req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    let where = {
      [Op.or]: {
        branch_name: {
          [Op.like]: `%${body.search_key}%`,
        },
        branch_manager: {
          [Op.like]: `%${body.search_key}%`,
        },
      },
    }
    if(req.isBranch) {
      where.branch_id = req.branch_id
    } else {
      where.user_id = req.userId
    }
   
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query = {
      where,
      include: [
        {
          model: db.car,
          as: "carDetails",
        },
        {
          model: db.city,
          as: "cityData",
        },
        {
          model: db.district,
          as: "districtData",
        }

      ],
      limit: body.limit,
      offset: body.offset,
      order: [["branch_id", "DESC"]],
    };
    let result = await branch.findAllBranches(query);
    let allCount = await branch.recordCount({where: where});
    result = JSON.parse(JSON.stringify(result)) 

    if (result.length) {
      for (let i = 0; i < result.length; i++) {
        if(result[i].cityData && result[i].cityData.name) {
          result[i].city_name = result[i].cityData.name 
        }
        if(result[i].districtData && result[i].districtData.name) {
          result[i].district_name = result[i].districtData.name 
        }
      }
      let resp = {
        count: allCount,
        data: result,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.addCar = async (req, res) => {
  try {
    let body = req.body;
    if(body.branch_id) {
      let branchD = await branch.singleRecord({where: {isActive: true, branch_id: body.branch_id}})
      if(!branchD) {
        res.status(400).json({message: {en:'branch not found', ar: 'الفرع غير موجود'}})
        return
      }
      // if(branchD.isAddCar === false || branchD.isAddCar === 0) {
      //   res.status(400).json({message: {en:'you can not add new vehicle', ar: 'لا يمكنك إضافة مركبة جديدة'}})
      //   return
      // }
    }
    if(req.isBranch) {
      let branchD = await branch.singleRecord({where: {isActive: true, branch_id: req.branch_id}})
      if(!branchD) {
        res.status(400).json({message: {en:'branch not found', ar: 'الفرع غير موجود'}})
        return
      }
      if(branchD.isAddCar === false || branchD.isAddCar === 0) {
        res.status(400).json({message: {en:'you can not add new vehicle', ar: 'لا يمكنك إضافة مركبة جديدة'}})
        return
      }
      if(branchD.isAddCar === false || branchD.isAddCar === 0) {
        res.status(400).json({message: {en:'you can not add new vehicle', ar: 'لا يمكنك إضافة مركبة جديدة'}})
        return
      }
      req.body.user_id = branchD.user_id;
      req.body.branch_id = req.branch_id;
    } else {
      req.body.user_id = req.userId;
    }
    body.car_plate = body.car_plate.toUpperCase()
    
    let query = {
      where: {
        car_plate: body.car_plate,
      },
    };
    let carPlate = await car.singleRecord(query);
    if (carPlate) {
      res.status(400).json({message : {en: "vehicle plate already exist", ar: 'لوحة السيارة موجودة بالفعل'}});
      return;
    }
    let dataObject = await car.createRecord(req.body);
    res.send(dataObject);
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
};

exports.cars = async (req, res) => {
  try {
    let body = req.query;
    let where
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(req.isBranch) {
      if(!body.search_key) {
        where = {branch_id : req.branch_id}
      } else if(body.search_key) {
        where = {
          [Op.or]: {
            car_plate: {
              [Op.like]: `%${body.search_key}%`,
            },
          },
          branch_id: req.branch_id,
        }
      } 
    } else {
      if(!body.search_key && !body.branch_id) {
        where = {user_id: req.userId}
      } else if(body.search_key && body.branch_id) {
        where = {
          [Op.or]: {
            car_plate: {
              [Op.like]: `%${body.search_key}%`,
            },
          },
          branch_id: body.branch_id,
          user_id: req.userId,
        }
      } else if(body.branch_id) {
        where = {user_id: req.userId, branch_id: body.branch_id}
      } else {
        where =  {
          [Op.or]: {
            car_plate: {
              [Op.like]: `%${body.search_key}%`,
            },
          },
          user_id: req.userId 
        }
      } 
    }  
    let query = {
      limit: body.limit,
      offset: body.offset,
      where,
      include: [
        {
          model: db.branch,
          as: "BranchDeytails",
        },
        {
          model: db.carType,
          as: "carTypeDetails",
        },
        {
          model: db.year,
          as: "yearDetails",
        },
        {
          model: db.brand,
          as: "brandDetails",
        },
        {
          model: db.fuelPrice,
          as: "fuelTypeDetails",
        },
      ],
      order: [["car_id", "DESC"]],
    };
    let result = await car.findAndCount(query);
    let countData = await car.countRecord({where: where});

    result = JSON.parse(JSON.stringify(result))
    if (result.rows.length) {
      for (let i = 0; i < result.rows.length; i++) {
        if(result.rows[i].hasOwnProperty('carTypeDetails') && result.rows[i].carTypeDetails.hasOwnProperty('name')) {
          result.rows[i].car_type_name = result.rows[i].carTypeDetails.name
        }
        if(result.rows[i].fuelTypeDetails && result.rows[i].fuelTypeDetails.fuel_type) {
          result.rows[i].fuelType= result.rows[i].fuelTypeDetails.fuel_type
        }
        if(result.rows[i].BranchDeytails && result.rows[i].BranchDeytails.branch_name) {
          result.rows[i].branch_name = result.rows[i].BranchDeytails.branch_name
        }      
      }
      let resp = {
        count: countData,
        data: result.rows,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};
exports.branchStatusUpdate = async (req, res) => {
  try {
    
    
    let bodybject = {
      isActive: req.body.isActive,     
    };
    let queryObject = {
      where: { user_id: req.userId, branch_id: req.params.id },
    };
    // checking record exiting or not
    let branchObject = await branch.singleRecord(queryObject);
    if (!branchObject) {
      res.status(400).json({message: {en: "branch not exit", ar: 'فرع لا يخرج'}});
      return;
    }
    await branch.updateRecord(bodybject, queryObject);
    res.json({message: {en:"Status update successfully changed", ar: 'تم تغيير تحديث الحالة بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.branchUpdate = async (req, res) => {
  try {
    let body = req.body
    if(req.body.credit !== undefined) {
      delete req.body.credit
    }

    let queryObject = {
      where: { user_id: req.userId, branch_id: req.params.id },
    };
    // checking record exiting or not
    let branchObject = await branch.singleRecord(queryObject);
    if (!branchObject) {
      res.status(400).json({message: {en: "branch not exit", ar: 'فرع لا يخرج'}});
      return;
    }
    let getBranch

    // checking email 
    if(req.body.email) {
      getBranch = await branch.singleRecord({where: {email: req.body.email}})
      let getUser = await singleRecord({where: {email: req.body.email}})
      if(getBranch || getUser) {
        res.status(400).json({message: {en: "Email already exists", ar:'البريد الالكتروني موجود بالفعل'}})
        return;
      } 
    }
   let checkBranch =  await branch.updateRecord(body, queryObject);
   console.log({checkBranch})
   if(checkBranch[0] === 1) {
    if(req.body.isActive === false || req.body.isActive === 0) {
      // get all car credit sum associate with with branch this branc
      let sum  =  await car.findAllcars({
        where: queryObject.where,
        attributes: [
          [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
      ]
      })
      sum = JSON.parse(JSON.stringify(sum))
      let userD = await singleRecord({where:{user_id: req.userId}})
      let sumAmount = 0
      
      sumAmount = parseFloat(sumAmount) + parseFloat(branchObject.credit ? branchObject.credit: 0 )
      sumAmount = parseFloat(sumAmount) + parseFloat(sum[0].credit ? sum[0].credit : 0)
      sumAmount = parseFloat(sumAmount) + parseFloat(userD.credit ? userD.credit : 0)
      if(sumAmount > 0) {
        await updateRecord({credit: sumAmount}, {where: {user_id: req.userId}})
        await branch.updateRecord({credit: 0}, queryObject)
        await car.updateRecord({credit: 0, isActive: false}, queryObject)
      } 
    }
   }
    if(req.body.email) {
      await mail.UpdateBranch(branchObject, req.body.email)
    }
    res.json({message: {en:"Branch update successfully changed", ar: 'تم تغيير تحديث الفرع بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.carStatusUpdate = async (req, res) => {
  try {
    let bodybject = {
      isActive: req.body.isActive,
      fuel_type: req.body.fuel_type
    };
    let queryObject = {
      where: { user_id: req.userId, car_id: req.params.id },
    };
    // checking record exiting or not
    let carObject = await car.singleRecord(queryObject);
    if (!carObject) {
      res.status(400).json({message: {en:"vehicle not exit", ar: 'السيارة لا تخرج'}});
      return;
    }
    await car.updateRecord(bodybject, queryObject);
    res.json({message: {en: "Status successfully changed", ar: 'تم تغيير الوضع بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.carUpdate = async (req, res) => {
  try {
    let body = req.body
    if(req.body.credit !== undefined) {
      delete req.body.credit
    }
    let queryObject = {
      where: { user_id: req.userId, car_id: req.params.id },
    };
    // checking record exiting or not
    let carObject = await car.singleRecord(queryObject);
    if (!carObject) {
      res.status(400).json({message: {en: "vehicle car not exit", ar: 'السيارة السيارة لا تخرج'}});
      return;
    }
    let obj = await car.updateRecord(body, queryObject);
    if(obj[0] === 1) {
      if(body.isActive === false || body.isActive === 0) {
        let branchObj  = await branch.singleRecord({where: {isActive : true, branch_id: carObject.branch_id}})
        if(branchObj){
          let total = parseFloat(carObject.credit ? carObject.credit : 0)+parseFloat(branchObj.credit ? branchObj.credit : 0)
          if(total > 0) {
            await branch.updateRecord({credit: total}, {where: {isActive : true, branch_id: carObject.branch_id}})
            await car.updateRecord({credit: 0}, {where: {car_id: req.params.id, branch_id: carObject.branch_id}})
          }
        }
      }
    }
    res.json({message: {en: "vehicle update successfully changed", ar: 'تم تغيير تحديث السيارة بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.addAmountToCar = async (req, res) => {
  try {
    let body = req.body;
    //check balance is avalible or not
    let query = {
      where: {
        branch_id: body.branch_id,
      },
    };
    let barnchObj = await branch.singleRecord(query);
    if (!barnchObj) {
      res.status(400).json({message: {en: "branch is not exits", ar: 'فرع ليس مخارج'}});
      return;
    }
    if (barnchObj.credit === null || barnchObj.credit === "0.00") {
      res
        .status(400)
        .json({message: {en:"You do not have credit to this branch for adding balance", ar: 'ليس لديك رصيد لهذا الفرع لإضافة رصيد'}});
      return;
    }
    if (barnchObj.credit < body.amount) {
      res
        .status(400)
        .json({message: {en:"Branch credit is below the entered amount", ar: 'رصيد الفرع أقل من المبلغ المدخل'}});
      return;
    }
    // check car exits or not
    delete query.where.branch_id;
    query.where.car_id = body.car_id;
    let carObj = await car.singleRecord(query);
    if (!carObj) {
      res.status(400).json({message: {en:"Vehicle is not exits", ar:'السيارة ليست مخارج'}});
      return;
    }
    if (carObj.isActive === false || carObj.isActive === 0) {
      res.status(400).json({message: {en:"Vehicle is Deactivated", ar:'السيارة معطلة'}});
      return;
    }
    // amount update in car
    let carAmount = 0;
    if (carObj.credit === null || carObj.credit === "0.00") {
      carAmount = parseFloat(body.amount);
    } else {
      carAmount = parseFloat(body.amount) + parseFloat(carObj.credit);
    }
    let bodybject = {
      credit: parseFloat(carAmount),
    };
    let queryObject = {
      where: { user_id: req.userId, car_id: req.body.car_id },
    };
    await car.updateRecord(bodybject, queryObject);
    // amount update in branch
    let branchAmount = barnchObj.credit - body.amount;
    let branchUpdate = {
      where: { user_id: req.userId, branch_id: req.body.branch_id },
    };
    await branch.updateRecord({ credit: branchAmount }, branchUpdate);
    res.json({message: {en: "Balance added successfullly", ar:'تمت إضافة الرصيد بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.removeAmountToCar = async (req, res) => {
  try {
    let body = req.body;
    //check balance is avalible or not
    let query = {
      where: {
        car_id: body.car_id,
      },
    };
    let carObj = await car.singleRecord(query);
    if (!carObj) {
      res.status(400).json({message: {en:"Vehicle is not exits", ar:'السيارة ليست مخارج'}});

      return;
    }
    if (carObj.credit === null || carObj.credit === "0.00") {
      res
        .status(400)
        .json({message: {en: "This vehicle do not have credit to remove balance", ar: 'هذه السيارة ليس لديها رصيد لإزالة الرصيد'}});
      return;
    }
    if (carObj.credit < body.amount) {
      res
        .status(400)
        .json({message: {en:"Your amount must be less then into vehicle balance amount", ar:'يجب أن يكون المبلغ أقل من مبلغ رصيد السيارة'}});
      return;
    }
    // check car exits or not
    delete query.where.car_id;
    query.where.branch_id = body.branch_id;
    let branchObj = await branch.singleRecord(query);
    if (!branchObj) {
      res.status(400).json({message: {en: "Branch is not exits", ar: 'الفرع ليس مخارج'}});
      return;
    }
    // amount update in car
    let branchAmount = 0;
    if (branchObj.credit === null || branchObj.credit === "0.00") {
      branchAmount = parseFloat(body.amount);
    } else {
      branchAmount = parseFloat(body.amount) + parseFloat(branchObj.credit);
    }
    let bodybject = {
      credit: parseFloat(branchAmount),
    };
    let queryObject = {
      where: { user_id: req.userId, branch_id: req.body.branch_id },
    };
    await branch.updateRecord(bodybject, queryObject);
    // amount update in branch
    let carAmount = parseFloat(carObj.credit) - parseFloat(body.amount);
    let carUpdate = {
      where: { user_id: req.userId, car_id: req.body.car_id },
    };
    await car.updateRecord({ credit: carAmount }, carUpdate);
    res.json({message: {en: "balace remove from car successfullly", ar: 'إزالة balace من السيارة بنجاح'}});
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.addAmountToBranch = async (req, res) => {
  try {
    let body = req.body;
    let query = {
      where: {
        branch_id: body.branch_id,
      },
    };
    let branchObject = await branch.singleRecord(query);
    if (!branchObject) {
      res.status(400).json({message: {en: "Branch is not exits", ar: 'الفرع ليس مخارج'}});
      return;
    }
    if(branchObject.isActive === false || branchObject.isActive === 0) {
      res.status(400).json({message: {en: "Branch is Deactive", ar: 'الفرع معطل'}});
      return; 
    }
    // checking user wallet
    delete query.where.branch_id;
    query.where.user_id = req.userId;
    let userObject = await singleRecord(query);
    if (!userObject) {

      res.status(400).json({message: {en: "user does not exists", ar: 'المستخدم غير موجود'}});
      return;
    }
    if (userObject.credit_wit_charges === null || userObject.credit_wit_charges === "0.00") {
      res.status(400).json({message: {en: 'Your wallet is empty please contact your admin', ar: 'محفظتك فارغة يرجى الاتصال بالمسؤول'}});
      return;
    }
    if (userObject.credit_wit_charges < body.amount) {
      res
        .status(400)
        .json({message:{en: "Available credit is below the entered amount", ar: 'الرصيد المتاح أقل من المبلغ المدخل'}});
      return;
    }
    // update in user Model
    if (userObject.credit_wit_charges) {
      calculatedAmount = parseFloat(userObject.credit_wit_charges) - parseFloat(body.amount);
    }
    let bodyObject = {
      credit_wit_charges: calculatedAmount,
      credit: parseFloat(userObject.credit) - parseFloat(body.amount)
    };
    await updateRecord(bodyObject, {
      where: {
        user_id: req.userId,
      },
    });
    // update branch Model
    let updateAmount;
    if (branchObject.credit === null || branchObject.credit === "0.00") {
      updateAmount = parseFloat(body.amount);
    } else {
      updateAmount = parseFloat(branchObject.credit) + parseFloat(body.amount);
    }
    await branch.updateRecord(
      { credit: updateAmount },
      {
        where: {
          branch_id: body.branch_id,
          user_id: req.userId,
        },
      }
    );
    await mail.creditForBranch(branchObject, body.amount)
    res.json({message: {en:"balance added successfully", ar: 'تمت إضافة الرصيد بنجاح'}});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.removeAmountToBranch = async (req, res) => {
  try {
    let body = req.body;
    let query = {
      where: {
        user_id: req.userId,
      },
    };
    let userObject = await singleRecord(query);
    if (!userObject) {
      res.status(400).json({message: {en: "user does not exists", ar: 'المستخدم غير موجود'}});
      return;
    }
    // checking user wallet
    delete query.where.user_id;
    query.where.branch_id = body.branch_id;
    let branchObject = await branch.singleRecord(query);
    if (!branchObject) {

      res.status(400).json({message: {en: "Branch is not exits", ar: 'الفرع ليس مخارج'}});
      return;
    }
    if (branchObject.credit === null || branchObject.credit === "0.00") {
      res.status(400).json({message: {en: "You don't have credit balance", ar: 'ليس لديك رصيد ائتماني'}});
      return;
    }
    if (branchObject.credit < body.amount) {
      res
        .status(400)
        .json({message: {en: "Your amount must be less then into wallet balance amount", ar: 'يجب أن يكون المبلغ أقل من مبلغ رصيد المحفظة'}});
      return;
    }
    // update in branch Model
    if (branchObject.credit) {
      calculatedAmount = parseFloat(branchObject.credit) - parseFloat(body.amount);
    }
    let bodyObject = {
      credit: calculatedAmount,
    };
    await branch.updateRecord(bodyObject, {
      where: {
        user_id: req.userId,
        branch_id: body.branch_id
      },
    });
    // update user Model
    let updateAmount;
    if (userObject.credit === null || userObject.credit === "0.00") {
      updateAmount = parseFloat(body.amount);
    } else {
      updateAmount = parseFloat(userObject.credit) + parseFloat(body.amount);
    }
    await updateRecord(
      { credit: updateAmount },
      {
        where: {
          user_id: req.userId,
        },
      }
    );
    res.json({message: {en: "remove balance from branch successfully",ar: 'إزالة الرصيد من الفرع بنجاح "'}});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.searchCarPlate = async (req, res) => {
  try {
    let body = req.body;
    let query = {
      where: {
        car_plate: body.car_plate,
        isActive: true
      },
      include: [
        {
          model: db.year,
          as: "yearDetails",
        },
        {
          model: db.brand,
          as: "brandDetails",
        },
        {
          model: db.carType,
          as: "carTypeDetails",
        },
        {
          model: db.fuelPrice,
          as: "fuelTypeDetails",
        },
      ]
    };
    let carObject = await car.singleRecord(query);
    if (!carObject) {
      res.status(400).json({ message: {en:'Vehicle does not exists', ar: 'المركبة غير موجودة'} });
      return
    }
    if (carObject.credit === null || carObject.credit === "0.00") {
      res.status(400).json({ message: {en: "you don't have enough credit", ar: 'ليس لديك ما يكفي من الائتمان'} });
      return
    }
    if(carObject.fuelTypeDetails === null || carObject.fuelTypeDetails === 'null') {
      res.status(400).json({ message: {en: "Car don't have a valid fuel type", ar: 'السيارة ليس لديها نوع وقود صالح'} });
      return
    }
    if(carObject.fuelTypeDetails && carObject.fuelTypeDetails.isActive === false) {
      res.status(400).json({ message: {en: "Car don't have a valid fuel type", ar: 'السيارة ليس لديها نوع وقود صالح'} });
      return
    }
    res.send(carObject);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};

exports.carList = async (req, res) => {
  try {
    let userId = req.userId
    let query =  {
      where: {
        user_id: userId,
        branch_id: null
      }
    }
    let carList = await car.findAllcars(query)
    if(carList.length) {
      res.send(carList)      
    } else {
      res.send([])
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.assignCarToBranch= async (req, res) => {
  try {
    let body = req.body
    console.log('body==>', body)
    if(body.car_ids && body.car_ids.length) {
      for (let i = 0; i < body.car_ids.length; i++) {
        let query = {
          where:{
            car_id: body.car_ids[i],
            user_id: req.userId
          }
        }
        let carDetail = await car.singleRecord(query)
        if(carDetail) {
          let bodyObject = {
            branch_id: body.branch_id
          }
          await car.updateRecord(bodyObject,query) 
        }        
      }
      res.json({message: {en: "Vehicle added successfully", ar: 'تمت إضافة السيارة بنجاح'}})

    } else {
      res.json({message: 'car_ids should be an array'})
      return
    }
  
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }  
}

exports.bulkBalanceAddtoBranch = async (req, res)=> {
  try {
    let body = req.body
    console.log(body.branch)
    let length = body.branch.length
    let ToalAmount = parseFloat(length) * parseFloat(body.amount)
    let query = {
      where: {
        user_id: req.userId
      }
    }
    let userD = await singleRecord(query)
    if(!userD) {
      res.status(400).json({message: {en: 'User not found', ar: 'المستخدم ليس موجود'}})
      return
    }

    if (userD.credit_wit_charges === null || userD.credit_wit_charges === "0.00" || userD.credit_wit_charges < ToalAmount) {
      res
        .status(400)
        .json({message: {en: "you don't have enough credit", ar: 'ليس لديك ما يكفي من الائتمان'}});
      return;
    }
    delete query.where.user_id     
    for (let i = 0; i < body.branch.length; i++) {
      console.log(body.branch[i])
      let query = {
        where: {
          branch_id : body.branch[i],
          user_id: req.userId,
          isActive: true 
        }
      }
      let branchObj = await branch.singleRecord(query)
      
      if(branchObj) {
        branchObj.credit = branchObj.credit ? branchObj.credit : 0
        let branchAmount = parseFloat(branchObj.credit) + parseFloat(body.amount) 
        let success = await branch.updateRecord({credit: branchAmount},query)
        if(success[0] === 1) {
          let userDetails = await singleRecord({where: {user_id: req.userId}})
          let subtractAmount = parseFloat(userDetails.credit_wit_charges) - parseFloat(body.amount)
          let subtractAmountCredit = parseFloat(userDetails.credit) - parseFloat(body.amount)

          let b = await updateRecord({credit_wit_charges: subtractAmount, credit: subtractAmountCredit}, {where: {user_id: req.userId}})
          if(branchObj && branchObj.email) {
            await mail.creditForBranch(branchObj, body.amount)
          }      
        }
      }
    }
    
    res.send({message: {en: 'Amount Added Successfully in Branch', ar: 'تمت إضافة المبلغ بنجاح في الفرع'}})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

module.exports.revertAmountToUserCredit = async (req, res)=> {
  try {
    let body = req.body
    let totalBanchAmount = parseFloat(body.branch.length) * parseFloat(body.amount)
    let query ={
      attributes: [
        [sequelize.fn('sum', sequelize.col('credit_wit_charges')), 'credit_wit_charges'],
    ],
      where : {
        branch_id : {
          [Op.in] :body.branch 
        },
        user_id: req.userId,
        isActive: true
      }
    }
    let getTotal= await branch.findAllBranches(query)
    
    if (getTotal[0].credit_wit_charges === null || getTotal[0].credit_wit_charges === "0.00" || getTotal[0].credit_wit_charges < totalBanchAmount) {
      res
        .status(400)
        .json({message: {en: "you don't have enough credit", ar: 'ليس لديك ما يكفي من الائتمان'}});
      return;
    }    
    for (let i = 0; i < body.branch.length; i++) {
      console.log(body.branch[i])
      let query = {
        where: {
          branch_id : body.branch[i],
          isActive: true
        }
      }
      let branchObj= await branch.singleRecord(query)
      if(branchObj) {
        if(branchObj.credit >= body.amount) {
          let subAmount = parseFloat(branchObj.credit) - parseFloat(body.amount)
         let b =   await branch.updateRecord({credit:subAmount}, query)
         if(b.length) {
           let userD = await singleRecord({ where: {user_id: req.userId}})
           let usableAddAmount = parseFloat(body.amount) + parseFloat(userD.credit_wit_charges)
           let addAmount = parseFloat(body.amount) + parseFloat(userD.credit)

          await updateRecord({credit: addAmount, credit_wit_charges: usableAddAmount}, { where: {user_id: req.userId}})
         }
        }
      }
    }
    res.send({message: {en:'Amount Added Successfully in User credit', ar: 'تمت إضافة المبلغ بنجاح في رصيد المستخدم'}})
   
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

module.exports.bulkAddbranchToCarAmount = async (req, res)=> {
  try {
    let array = req.body.array
    let amount = req.body.amount
    let body = req.body
    let isCheckCredit = false
    let isBranchNotActive = false
    let branchName
    for (let i = 0; i < array.length; i++) {
      let totalAmount = parseFloat(array[i].car.length) * parseFloat(body.amount)
      let branchAmount = await branch.singleRecord({where: {branch_id: array[i].branch_id}})
      if (branchAmount.isActive === false || branchAmount.isActive === 0 || branchAmount.isActive === 'false') {
        isBranchNotActive = true,
        branchName = branchAmount.branch_name
        break;
      }
      if (branchAmount.credit === null || branchAmount.credit === "0.00" || branchAmount.credit < totalAmount) {
        isCheckCredit = true
        break;
      }
    }
    if(isBranchNotActive) {
      res.status(400).json({message: {en: `Branch name ${branchName} deactivated`, ar: `تم إلغاء تنشيط اسم الفرع ${branchName}`}});
      return;
    }
    if(isCheckCredit) {
      res.status(400).json({message: {en: "you don't have enough credit", ar: 'ليس لديك ما يكفي من الائتمان'}});
      return;
    }
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].car.length; j++) {
        let branchAount = await branch.singleRecord({where:{branch_id: array[i].branch_id, user_id: req.userId}})
        if(parseFloat(branchAount.credit) >= amount) {
          let getcar = await car.singleRecord({where:{car_id: array[i].car[j], user_id: req.userId}})
          if(getcar) {
            getcar.credit = parseFloat(getcar.credit) ? parseFloat(getcar.credit) : 0
            let carAmount = parseFloat(getcar.credit) + parseFloat(amount)
            let updateAmount = await car.updateRecord({credit: carAmount},{where:{car_id: array[i].car[j], user_id: req.userId}})
            if(updateAmount.length) {
              let subsAmount = parseFloat(branchAount.credit) -  parseFloat(amount)
              await branch.updateRecord({credit: subsAmount},{where: {user_id: req.userId, branch_id: array[i].branch_id}}) 
            }
          }
        }
      }         
    }
    res.send({message: {en:"Amount added successfully", ar: 'تمت إضافة المبلغ بنجاح'}})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

module.exports.bulkRevertBranchToCarAmount = async (req, res)=> {
  try {
    let array = req.body.array
    let amount = req.body.amount  
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].car.length; j++) {
       let carDetail = await car.singleRecord({where: { user_id: req.userId, car_id: array[i].car[j]}})
       if(carDetail && carDetail.credit >= amount) {
        let branchD = await branch.singleRecord({where: {user_id: req.userId, branch_id: array[i].branch_id}})
        if(branchD && branchD.credit) {
          let addBranchAmount = parseFloat(branchD.credit)+parseFloat(amount)
          let updateInBranch = await branch.updateRecord({credit: addBranchAmount}, {where:{user_id: req.userId, branch_id: array[i].branch_id}})
          if(updateInBranch.length) {
            let subsAmount = parseFloat(carDetail.credit)-parseFloat(amount)
            await car.updateRecord({credit:subsAmount }, {where: {car_id: array[i].car[j], user_id: req.userId}})
         }
        }         
       } 
      }         
    }
    res.send({message: {en:"Amount revert successfully", ar: 'تم إرجاع المبلغ بنجاح'}})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

module.exports.getUserCredit = async (req, res)=> {
  try {
    if(req.isBranch) {
      let query = {
        where: {
          branch_id: req.branch_id
        }     
      }
      let branchBalance = await branch.singleRecord(query)
      if(!branchBalance) {
        res.status(400).json({message: {en:'branch not found', ar: 'الفرع غير موجود'}})
        return
      }  
      res.send({credit: branchBalance.credit})
      return
    }
    let query = {
      where: {
        user_id: req.userId
      }     
    }
    let userBalance = await singleRecord(query)
    if(!userBalance) {
      res.status(400).json({message: {en: 'User not found', ar: 'المستخدم ليس موجود'}})
      return
    }  
    res.send({credit: userBalance.credit})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

module.exports.updateProfile = async (req, res)=> {
  try {
   
    let id = req.userId
    let query = {
      where: {
        user_id: id
      }
    }
    let body = req.body
    if(body.password) {
      delete body.password
    }
    if(body.credit) {
      delete body.credit
    }
    let obj = await singleRecord(query)
    if(!obj) {
      res.status(400).json({message: {en: 'User not exist', ar: 'المستخدم غير متوفر'}})
      return
    }   
    if (req.files && req.files.profile_pic){
      let proTime = new Date().getTime() / 1000;
      await fileUpload(req.files.profile_pic, `${proTime}profile`);
      body.profile_pic = `./images/${proTime}profile.jpg`;


      if(obj.profile_pic) {
        let path = obj.profile_pic.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.vat_registration_certificate ){
      let vat = req.files.vat_registration_certificate
      let vatTime = new Date().getTime() / 1000;
      await fileUploadPdf(vat, `${vatTime}vat`);
      body.vat_registration_certificate = `./pdf/${vatTime}vat.pdf`;
      if(obj.vat_registration_certificate) {
        let path = obj.vat_registration_certificate.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
    }
    if (req.files && req.files.company_logo ){
      let logo = req.files.company_logo
      let logoTime = new Date().getTime() / 1000;
      await fileUpload(logo, `${logoTime}logo`);
      body.company_logo = `./images/${logoTime}logo.jpg`;
      if(obj.company_logo) {
        let path = obj.company_logo.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.commercial_registration_certificate){
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./pdf/${pathTime}commercial_registration_certificate.pdf`;
      if(obj.commercial_registration_certificate) {
        let path = obj.commercial_registration_certificate.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
     
    }  
    

    await updateRecord(body, query)
    res.send({message : {en: "profile is updated", ar: 'يتم تحديث الملف الشخصي'}})

  } catch (error) {
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}
module.exports.userProfile = async (req, res)=> {
  try {
    let id = req.userId
    let query = {
      where: {
        user_id: id
      },
      attributes: {
        exclude: ['password']
      }
    }
   
    let obj = await singleRecord(query)
    if(!obj) {
      res.send({message: {en: 'User not exist', ar: 'المستخدم غير متوفر'}})
      return
    }  
    res.send(obj) 
  } catch (error) {
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}




module.exports.CarBulkSearch = async (req, res)=> {
  try {
    let body = req.query;
    if(!body.branch_id) {
      body.branch_id = ""
    }
    let query = {
      limit: body.limit,
      offset: body.offset,      
      where: {
        [Op.or]: {
          car_plate: {
            [Op.like]: `%${body.search_key}%`,  
        },
        branch_id: body.branch_id
        },         
        user_id: req.userId,
      },
      include: [
        {
          model: db.branch,
          as: "BranchDeytails",
        },
      ],

      order: [["car_id", "DESC"]],
    };
    let result = await car.findAllcars(query);
    if (result.length) {
      let resp = {
        count: result.length,
        data: result,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}})
  }
}

module.exports.BranchBulkReset = async (req, res) => {
  try {
    let id = req.userId
    let body = req.body
    let query ={
      attributes: [
        [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
      ],
      where : {
        branch_id : {
          [Op.in] :body.branch 
        },
        user_id: req.userId
      }
    }
    let getTotal= await branch.findAllBranches(query)
    if (getTotal[0].credit === null || getTotal[0].credit === "0.00") {
      res
      .status(400)
      .json({message: {fn:`you don't have enough credit`, ar: 'ليس لديك ما يكفي من الائتمان'}});
      return;
    } 
    let user = await singleRecord({where: {user_id: id}})
    let total = parseFloat(user.credit) + parseFloat(getTotal[0].credit)
    let totalCreditCharge = parseFloat(user.credit_wit_charges) + parseFloat(getTotal[0].credit)


    let userUpdateAmount = await updateRecord({credit: total, credit_wit_charges: totalCreditCharge}, {where: {user_id: id}})
    if(userUpdateAmount[0]=== 1) {
      delete query.attributes
      await branch.updateRecord({credit: 0}, query)
      res.send({message: {en: 'Amount reset successfully',ar: 'تمت إعادة تعيين المبلغ بنجاح'} })
      return
    } else {
      res.status(400).json({message: {en:'Some thing went wrong for Amount reset',ar: 'حدث خطأ ما في إعادة تعيين المبلغ' }})
    }
  } catch (error) {
    console.log({error})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


module.exports.carBulkReset = async(req, res) => {
  try {
    let id = req.userId
    let body = req.body
    for (let i = 0; i < body.array.length; i++) {
      let query = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
        ],
        where : {
          car_id : {
            [Op.in] :body.array[i].car 
          },
          user_id: req.userId,
          branch_id: body.array[i].branch_id
        }
      }
      let getTotal = await car.findAllcars(query)
      console.log(getTotal)
      console.log(getTotal[0].credit)

      if(getTotal[0].credit) {
        let branchData = await branch.singleRecord({where: {branch_id: body.array[i].branch_id}})
        let total = parseFloat(branchData.credit) + parseFloat(getTotal[0].credit)
        await branch.updateRecord({credit: total}, {where:{branch_id: body.array[i].branch_id, user_id: id}})        
        delete query.attributes
        await car.updateRecord({credit: 0}, query)
      }      
    }
    res.send({message: {en: "Amount reset success", ar: 'إعادة تعيين المبلغ بنجاح'}})
  } catch (e) {
    console.log(e)
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
} 
exports.getAllBranch = async (req, res) => {
  try {
    let id = req.userId
    let where = {
      // isActive: true
    }
    if(req.isBranch) {
      where.branch_id = req.branch_id
      where.isActive = true

    } else {
      where.user_id = id 
    }

   
   let query = {
     where
   }
   // get all the branches 
   let branches = await branch.findAllBranches(query)
   res.send(branches)
  } catch (e) {
    console.log(e)
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.reportFilter = async(req, res)=> {
  try {
    let id = req.userId
    let body = req.query
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where:{
        [Op.or]: {
          branch_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          car_plate: {
            [Op.like]: `%${body.search_key}%`,
          },
          fuel_type: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
        user_id: id   
      },
      limit: body.limit,
      offset: body.offset
    }
    if(body.date) {
      // get first and last day of the date 
      let inputeDate = new Date(date);
      let firstDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth(), 1);
      let lastDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth() + 1, 0);
      query.where.createdAt = {
        [Op.gt]: firstDay + ' 00:00:00',
        [Op.lt]: lastDay + ' 23:59:59'
      }
    }
    console.log(query)
    let getreports = await report.findAndCount(query)
    if(getreports) {
      let resp = {
        data: getreports.rows,
        count: getreports.count
      }
    res.send(resp)

    } else {
      res.send([])
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
}

exports.billList = async(req, res)=> {
  try {
    let id = req.userId
    let body = req.query
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where:{
        [Op.or]: {
          bill_id: {
            [Op.like]: `%${body.search_key}%`,    
          },
          total: {
            [Op.like]: `%${body.search_key}%`,    
          }
        },
        user_id: id   
      },
      limit: body.limit,
      offset: body.offset
    }
    if(body.date) {
      query.where.createdAt = {
        [Op.gt]: body.date + ' 00:00:00',
        [Op.lt]: body.date + ' 23:59:59'
      }
    }
    console.log(query)
    let getBill = await bill.findAndCount(query)
    if(getBill) {
      let resp = {
        data: getBill.rows,
        count: getBill.count
      }
    res.send(resp)

    } else {
      res.send([])
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.vatBilList = async(req, res)=> {
  try {
    let id = req.userId
    let body = req.query
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where:{
        [Op.or]: {
          invoice_id: {
            [Op.like]: `%${body.search_key}%`,    
          },
          total: {
            [Op.like]: `%${body.search_key}%`,    
          }
        },
        user_id: id   
      },
      limit: body.limit,
      offset: body.offset,
      order: [["invoice_id","DESC"]],
    } 
    console.log(query)
    let invoiceData = await invoice.findAndCount(query)
    invoiceData = JSON.parse(JSON.stringify(invoiceData))
    let defaultFeeData = await defaultFee.findAllRecord()
    defaultFeeData  = JSON.parse(JSON.stringify(defaultFeeData))
    if(invoiceData && invoiceData.rows.length) {
      for (let i = 0; i < invoiceData.rows.length; i++) {
        invoiceData.rows[i].taxable_amount = invoiceData.rows[i].commission_amount
        invoiceData.rows[i].sub_total = invoiceData.rows[i].commission_amount
        invoiceData.rows[i].total_vat_percent = parseFloat(invoiceData.rows[i].commission_amount)*defaultFeeData[0].vat/100
        invoiceData.rows[i].total_sr = parseFloat(invoiceData.rows[i].commission_amount) + parseFloat(invoiceData.rows[i].total_vat_percent)   
      }
      let resp = {
        data: invoiceData.rows,
        count: invoiceData.count
      }
    res.send(resp)

    } else {
      res.send([])
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.saveCarWithCsv = async(req, res)=> {
  try {
    let id = req.userId
    var time = new Date().getTime() / 1000;
    if (req.files && req.files.file){      
      let data =  await csvUpload(req.files.file, time)
      let array = []
      if(data) {
        let path = `./public/images/${time}.csv`
        console.log({path})
        if (path){
          let jsonArray = await csv().fromFile(path);
          jsonArray.forEach(element => {
            element.user_id = id
            let key = Object.keys(element) 
            if(key.length >= 3) {
              
              element.user_id = id
              array.push(element)
            }
          });
          let isCarPlate = false
          let isBranchId = false
          let isType = false
          let isYear = false
          let isFuelType = false
          let isFuelTypeData = false

          let isBrand = false
          let carWithAnother = false
          let isCarTypeData = false
          let isBrandData = false
          let isYearData = false
          let isCarAlreadyExist = false
          let isBranchExists = false
          let catPlateValid = false
          let isAddCarStatus = false
          let branchName 
          let isBranchNotActive = false

          for (let i = 0; i < array.length; i++) {
            array[i].user_id = id
            if(req.isBranch) {
              array[i].branch_id = req.branch_id
            }
            if(!array[i].hasOwnProperty('car_plate')) {
              isCarPlate = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            if(!array[i].hasOwnProperty('branch_id')) {
              isBranchId = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            if(!array[i].hasOwnProperty('type')) {
              isType = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            if(!array[i].hasOwnProperty('year')) {
              isYear = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            if(!array[i].hasOwnProperty('fuel_type')) {
              isFuelType = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            if(!array[i].hasOwnProperty('brand')) {
              isBrand = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            array[i].car_plate = array[i].car_plate.toUpperCase()
            const carplateTest = /^[0-9]{4}[A-Z]{3}$/i;
            let checkingPlat = carplateTest.test(array[i].car_plate)
            if(checkingPlat === false || checkingPlat === 'false') {
              catPlateValid = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            let checkCar = await car.singleRecord({where: {car_plate: array[i].car_plate}})
            if(checkCar){
              isCarAlreadyExist = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            let yearData = await year.singleRecord({where: {name: array[i].year}})
            if(!yearData) {
              isYearData = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            let branchData = await branch.singleRecord({where: {branch_id: array[i].branch_id, user_id: array[i].user_id }})
            if(!branchData) {
              isBranchExists = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            if(req.isBranch) {
              if(branchData.isAddCar === false || branchData.isAddCar === 0) {
                isAddCarStatus = true
                if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                break;
              }
            }
            if(branchData.isActive === false || branchData.isActive === 0) {
              isBranchNotActive = true
              branchName = branchData.branch_name 
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
          
            let carTypeData = await carType.singleRecord({where: {name: array[i].type}})
            if(!carTypeData) {
              isCarTypeData = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }          
            let brandData = await brand.singleRecord({where: {name: array[i].brand}})
            if(!brandData) {
              isBrandData = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            let fuelType = await fuelPrice.singleRecord({where: {fuel_type: array[i].fuel_type}})
            if(!fuelType) {
              isFuelTypeData = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            array[i].year_id = yearData.year_id
            array[i].car_type_id = carTypeData.car_type_id,
            array[i].brand_id = brandData.brand_id
            array[i].fuel_type_id = fuelType.fuel_price_id

          }
          if(isCarPlate) {
            res.status(400).json({message: {en: 'Car plat is required', ar: 'مطلوب لوحة السيارة'}})
            return;
          }
          if(isBranchNotActive) {
            res.status(400).json({message: {en: `Branch name ${branchName} deactivated`, ar: `تم إلغاء تنشيط اسم الفرع ${branchName}`}});
            return;
          }
          if(isBranchId) {
            res.status(400).json({message: {en:'Branch id is required', ar: 'معرف الفرع مطلوب'}})
            return;
          }
          if(isYear) {
            res.status(400).json({message: {en:'Year is required', ar: 'السنة مطلوبة'}})
            return;
          }
          if(isType) {
            res.status(400).json({message: {en:'Type is required', ar: 'النوع مطلوب'}})
            return;
          }
          if(isBrand) {
            res.status(400).json({message: {en:'Brand is required', ar: 'العلامة التجارية مطلوبة'}})
            return;
          }
          if(isFuelType) {
            res.status(400).json({message: {en: 'fuel type is required', ar: 'نوع الوقود مطلوب'}})
            return;
          }
          if(isFuelTypeData) {
            res.status(400).json({message: {en:'fuel type not found', ar: 'نوع الوقود غير موجود'}})
            return;
          }
          if(isBranchExists) {
            res.status(400).json({message: {en:'Branch not exists', ar: 'الفرع غير موجود'}})
            return; 
          }
          if(isCarAlreadyExist) {
            res.status(400).json({message: {en:'car plate already exists', ar:'لوحة السيارة موجودة بالفعل'}})
            return;
          }
          if(isYear) {
            res.status(400).json({message: 'Year is required'})
            return;
          }
          if(isYearData) {
            res.status(400).json({message: {en:'Year not valid', ar: 'السنة مطلوبة'}})
            return;
          }
          
          if(isCarTypeData){
            res.status(400).json({message: {en: 'car type not exists', ar: 'نوع السيارة غير موجود'}})
            return;
          }
          if(isFuelType) {
            res.status(400).json({message: {en:'car fuel type exists', ar: 'نوع وقود السيارة موجود'}})
            return;
          }
          if(isBrandData) {
            res.status(400).json({message: {en: 'Brand not found', ar: 'لم يتم العثور على العلامة التجارية'}})
            return;
          }
          if(catPlateValid) {
            res.status(400).json({message: {en: 'Vehicle plate not vaid', ar: 'لوحة المركبة غير مدفوعة'}})
            return;
          }
          if(isAddCarStatus) {
            res.status(400).json({message: {en:'Branch have no rights to add new vehicle', ar: 'الفرع ليس له الحق في إضافة مركبة جديدة'}})
            return
          }
          await car.bulCreateRecord(array)        
          if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
          res.send({message: {en: 'car uploaded successfully', ar: 'تم تحميل السيارة بنجاح'}})
        } else {
          if (fs.existsSync(path)) fs.unlinkSync(path);
          res.send({message: {en: 'csv not converted plase try again', ar: 'لم يتم تحويل csv يرجى المحاولة مرة أخرى'}})
          return
        }
      } else {
        res.send("file not uploaded ")
        return
      }
    } else {
      res.send({"message": {
        en:"csv file required"
      }})
      return
    }
 
  } catch (e) {
    console.log({e})
    if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.fuelTypeList = async(re, res) => {
  try {
    let Data = await fuelPrice.findAllRecord({where: {isActive: true, vat: null}})
    res.send(Data)
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});    
  }
}


exports.allTransactions = async (req, res) => {
  try {
    let body = req.query
    let id = req.userId
    let where
    if(!body.search_key) {
      body.search_key = ''
    }
   
    if(req.isBranch) {
      where = {
        [Op.or]: {
          car_plate: {
            [Op.like]: `%${body.search_key}%`,
          }
        },
        branch_id : req.branch_id              
      }
    } else {
      where = {
        [Op.or]: {
          car_plate: {
            [Op.like]: `%${body.search_key}%`,
          }
        },
        user_id : id              
      }
    }
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    
    let query = {
      where,
      include: [
        {
          model: db.car,
          as: "carDetails",
        },
        {
          model: db.fuelPrice,
          as: "fuelTypeDetails"
        }
      ],
      limit: body.limit,
      offset: body.offset, 
      order: [["transaction_id", "DESC"]],    

    }
    if(body.start_date && body.end_date) {
      query.where.createdAt = {
        [Op.gt]: body.start_date + ' 00:00:00',
        [Op.lt]: body.end_date + ' 23:59:59'
      }
    }
    let trans = await transaction.findAlltransactions(query)
    let count = await transaction.countRecord({where: where})
    if(trans.length) {
      trans = JSON.parse(JSON.stringify(trans))
      for (let i = 0; i < trans.length; i++) {
        trans[i].createdTime = moment(trans[i].createdAt).format('HH:mm');
        trans[i].createdDate = moment(trans[i].createdAt).format('DD-MM-YYYY');

        if(trans[i].fuelTypeDetails && trans[i].carDetails) {
          
          trans[i].carDetails.fuelTypeDetails = trans[i].fuelTypeDetails
          trans[i].fuelType = trans[i].fuelTypeDetails.fuel_type
        }
      }
      let obj = {}
      obj.data = trans
      obj.count = count
      res.send(obj)
    } else {
      res.send([])
    }

  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.billForcredit = async (req, res)=> {
  try {
    let body = req.query
    let id = req.userId
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where: {
        [Op.or]: {
          transcation_id: {
            [Op.like]: `%${body.search_key}%`,
          },
          transfer_amount: {
            [Op.like]: `%${body.search_key}%`,
          }, 

        },
        user_id: id,
        isActive: true          
      },
      limit: body.limit,
      offset: body.offset,   
      order: [["transcation_id", "DESC"]],
    }
    if(body.start_date && body.end_date) {
      query.where.createdAt = {
        [Op.gt]: body.start_date + ' 00:00:00',
        [Op.lt]: body.end_date + ' 23:59:59'
      }
    }
    let trans = await adminTransaction.findAllRecords(query)
    delete query.limit
    delete query.offset
    delete query.order

    let count = await adminTransaction.recordCount(query)
    if(trans.length) {
      let obj = {}
      obj.data = trans
      obj.count = count
      res.send(obj)
      return
    } else {
      res.send([])
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}
exports.invoiceList123 = async(req, res) => {
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
  for (let i = 0; i < data.length; i++) {

    let getCarCount = await car.countRecord({where: {user_id: data[i].user_id}})
    let userD = await user.singleRecord({where: {user_id: data[i].user_id}})
    if(userD && (userD.commission === null || userD.commission === 'null')){
      defaultFeeData[0].commission = await helper.getCommission(getCarCount)
    } else if(userD && (userD.commission === 0 || userD.commission === '0.00')){
      defaultFeeData[0].commission = 0
    }
    data[i].credit_consumed =  parseFloat(data[i].amount) - parseFloat(userD.credit)

    data[i].vat_percentage = defaultFeeData[0].vat
    data[i].commission_percent = defaultFeeData[0].commission
    data[i].commission_amount = (parseFloat(data[i].amount) * parseFloat( defaultFeeData[0].commission))/100
    data[i].vat = (parseFloat(data[i].amount) * parseFloat(defaultFeeData[0].vat))/100
    data[i].total = parseFloat(data[i].amount ) + parseFloat(data[i].vat)
    data[i].start_date = start + ' 00:00:00'
    data[i].end_date = end + ' 23:59:59'   
    let obj = await invoice.createRecord(data[i])
     if(obj){
      let data = `<!DOCTYPE html>
      <html>
      <head>
        <title></title>
      </head>
      <body>
      <p>Dear ${userD.f_name}<p>
      <p>Your invoice is create between the date ${start} and ${end}<p>
      </body>
      </html>`
      let object = {
        to: userD.email,
        subject: "New Invoice Created",
        // text: `,
         html: data
      };
      await emailsend(object)
     }
  }
  console.log(`${data} successfully run the job`)
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
}

exports.invoiceList = async (req, res)=> {
  try {
    let body = req.query
    let id = req.userId
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where: {
        [Op.or]: {
          amount: {
            [Op.like]: `%${body.search_key}%`,
          }, 

        },
        user_id: id,               
      },
      limit: body.limit,
      offset: body.offset,   
      order: [["invoice_id", "DESC"]],
    }
    let trans = await invoice.findAllUsers(query)
    let count = await invoice.recordCount({where: {user_id: id}})
    if(trans.length) {
      let obj = {}
      obj.data = trans
      obj.count = count
      res.send(obj)
    } else {
      res.send([])
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.logout = async(req, res) => {
  try {
    let date = new Date()
    await updateRecord({last_login: date, remember_me: false}, {where: {user_id: req.userId}}) 
    res.send({message: {en: "logout successfully", ar: 'تسجيل الخروج بنجاح'}})
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.emp = async(req, res) => {
  try {
    let body = req.body
    body.user_id = req.userId
    if(body.email) {
      let emailData = await userEmp.singleRecord({where: {email: body.email}})
      if(emailData) {
        res.status(400).json({message:{
          ar: 'البريد الإلكتروني مسجل مسبقا',
          en: "Email already registered" 
        }});
        return;
      }
    }    
    await userEmp.createRecord(body)
    res.send({message : {en:'employee created successfully', ar: 'تم إنشاء الموظف بنجاح'}})
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.empUpdate = async(req, res) => {
  try {
    let body = req.body
    let empId = req.params.id
    let empDetails = await userEmp.singleRecord({where: {emp_id: empId, user_id: req.userId}})
    if(!empDetails) {
      res.status(400).send({message : {en:'Record not found', ar: 'تم إنشاء الموظف بنجاح'}})
      return
    }
    await userEmp.updateRecord(body, {where: {emp_id: empId, user_id: req.userId}})
    res.send({message : {en:'Record update successfully', ar: 'تم إنشاء الموظف بنجاح'}})
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.empDelete = async(req, res) => {
  try {
    let empId = req.params.id
    let empDetails = await userEmp.singleRecord({where: {emp_id: empId, user_id: req.userId}})
    if(!empDetails) {
      res.status(400).send({message : {en:'Record not found', ar: 'تم إنشاء الموظف بنجاح'}})
      return
    }
    await userEmp.deleteUser({where: {emp_id: empId, user_id: req.userId}})
    res.send({message : {en:'Record deleted successfully', ar: 'تم إنشاء الموظف بنجاح'}})
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.userEmpList = async(req, res) => {
  try {
    let body = req.query
    let id = req.userId
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where: {
        [Op.or]: {
          f_name: {
            [Op.like]: `%${body.search_key}%`,
          }, 
          l_name: {
            [Op.like]: `%${body.search_key}%`,
          }, 
          email: {
            [Op.like]: `%${body.search_key}%`,
          },
          emp_code: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
        user_id: id,               
      },
      limit: body.limit,
      offset: body.offset,   
      order: [["emp_id", "DESC"]],
    }
    let empList = await userEmp.findAllUsers(query)
    let count =  await userEmp.recordCount(query)
    let obj = {
      data: empList,
      count
    }
    res.send(obj)

  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.saveEmpWithCsv = async(req, res)=> {
  try {
    let id = req.userId
    var time = new Date().getTime() / 1000;
    if (req.files && req.files.file){
      let data =  await csvUpload(req.files.file, time)
      let array = []
      const path  = `./public/images/${time}.csv`
      if(data) {
        if(path) {
          const jsonArray = await csv().fromFile(`./public/images/${time}.csv`);
        if(jsonArray.length) {
          jsonArray.forEach(element => {
            element.user_id = id
            let key = Object.keys(element) 
            if(key.length >= 3) {             
              element.user_id = id
              array.push(element)
            }
          });
          let isMobile = false
          let isMailExists
          for (let i = 0; i < array.length; i++) {
            if(array[i] && array[i].email) {
              let emailData = await userEmp.singleRecord({where: {email: array[i].email}})
              if(emailData) {
                isMailExists = true
                if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                break
              }
            }
            let mobileRegex = /^(?=.{10,15})\d{10,15}$/gm
            let checking = mobileRegex.test(array[i].mobile)
            if(checking === 'false' || checking === false) {
              isMobile = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
            }
          }
          if(isMobile) {
            res.status(400).json({
              message: {
                en: "Mobile number not valid",
                ar: 'رقم الجوال غير صالح'
              }
            })
            return;
          }
          if(isMailExists){
            res.status(400).json({message:{
              ar: 'البريد الإلكتروني مسجل مسبقا',
              en: "Email already registered" 
            }});
            return;
          }
          await userEmp.bulCreateRecord(array)        
          if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
          res.send({message: {en: 'Employee created successfully', ar: 'تم إنشاء الموظف بنجاح'}})
        }
        } else {
          if (fs.existsSync(path)) fs.unlinkSync(path);
          res.send({message: {en: 'csv not converted plase try again', ar: 'لم يتم تحويل csv يرجى المحاولة مرة أخرى'}})
          return
        }
      }
    } else {
      res.status(400).send({message:'Please enter csv file'})
      return;
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.empEmailSend = async(req, res) => {
  try {
    let body = req.body
    if(body.email.length) {
      for (let i = 0; i < body.email.length; i++) {
        let detail = await userEmp.singleRecord({where: {email: body.email[i]}})
        if(detail){
          await mail.allEmployee(detail,body.email[i])
        } 
      }
      res.send({message: {en: 'Email send successfully', ar: 'أرسل البريد الإلكتروني بنجاح'}})
    } else {
      res.status(400).json({messag:'email end must be array'})
      return
    }
    await userEmp.createRecord(body)
    res.send({message : {en: 'employee created successfully', ar: 'تم إنشاء الموظف بنجاح'}})
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.vatBillDetails = async(req, res) => {
  try {
    let data = await invoice.singleRecord({where: {invoice_id: req.params.id, isActive: true}})
    data = JSON.parse(JSON.stringify(data))
    if(data) {
      let defaultFeeData = await defaultFee.findAllRecord()
      defaultFeeData  = JSON.parse(JSON.stringify(defaultFeeData))
      data.taxable_amount = data.commission_amount
      data.sub_total = data.commission_amount
      data.total_vat_percent = parseFloat(data.commission_amount)*defaultFeeData[0].vat/100
      data.total_sr = parseFloat(data.commission_amount) + parseFloat(data.total_vat_percent)
      let array = []
      array.push(data)
      let re = {
        array: array,
        obj: data
      }
      res.send(re)
    } else {
      res.status(400).json({message:{
        en: 'Data not found',
        ar: 'لم يتم العثور على بيانات' 
      }});
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.districtData = async(req, res)=> {
  try {
    let id = req.userId
    let time = new Date().getTime() / 1000;
    if (req.files && req.files.file){
      let data =  await csvUpload(req.files.file, time)
      let array = []
      if(data) {
        const jsonArray = await csv().fromFile(`./public/images/${time}.csv`);
        console.log(jsonArray.length, '---------')
        if(jsonArray.length) {
         await districtModel.bulCreateRecord(jsonArray)        
          if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
          res.send({message: {en: 'district uploaded successfully', ar: 'تم تحميل السيارة بنجاح'}})
        }
      }
    }
 
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}

exports.vatInvoiceList = async (req, res)=> {
  try {
    let body = req.query
    let id = req.userId
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where: {
        // [Op.or]: {
        //   amount: {
        //     [Op.like]: `%${body.search_key}%`,
        //   }, 

        // },
        user_id: id,               
      },
      include: [
        {
          model: db.user,
          as: "userDetails",
        },
        {
          model: db.station_emp,
          as: "stationDetails",
          include: [
            {
              model : db.gasCompany,
              as: 'companyDetails'
            }
          ]
        },
      ],
      limit: body.limit,
      offset: body.offset,   
      order: [["vat_invoice_id", "DESC"]],
    }
    let trans = await vatInvoice.findAllRecord(query)
    let count = await vatInvoice.recordCount({where: {user_id: id}})
    if(trans.length) {
      let obj = {}
      obj.data = trans
      obj.count = count
      res.send(obj)
    } else {
      res.send([])
    }
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}


exports.getVatInvoiseDetails = async(req, res)=> {
  try{
    let body = req.query
    if(!body.start_date) {
      res.status(400).json({message: {
        en:'Start date is required',
        ar: 'تاريخ البدء مطلوب'
      }})
      return
    }
    if(!body.end_date) {
      res.status(400).json({message: {
        en:'End date is required',
        ar: 'تاريخ الانتهاء مطلوب'
      }})
      return 
    }
    const startOfMonth =  moment(body.start_date).startOf('month').format('YYYY-MM-DD hh:mm:ss');
    const endOfMonth   = moment(body.start_date).endOf('month').format('YYYY-MM-DD hh:mm:ss');
    let start = moment(startOfMonth).startOf("day").format('YYYY-MM-DD')
    let end = moment(endOfMonth).endOf("day").format('YYYY-MM-DD')
    if(start === body.start_date ) {
      if((end === body.end_date)){
        let query = {
          where: {
            start_date: body.start_date + ' 00:00:00',
            end_date: body.end_date + ' 23:59:59',
            user_id: req.userId
          },
          include: [
            {
              model: db.user,
              as: "userDetails",
            },
            {
              model: db.station_emp,
              as: "stationDetails",
              include: [
                {
                  model : db.gasCompany,
                  as: 'companyDetails'
                }
              ]
            },
          ],
        }
        console.log(query)
        // process.exit()
        let vatInvoiceData = await vatInvoice.findAllRecord(query)
        if(vatInvoiceData.length) {
          res.send(vatInvoiceData)
        } else {
          res.send([])
        }
        return
      } else {
        res.status(400).json({
          message: {
            en: 'End date will be ending of month last date',
            ar: 'سينتهي تاريخ الانتهاء من الشهر الماضي التاريخ'
          }
        })
        return
      }
    } else {
      res.status(400).json({
        message: {
          en: 'Start date will be starting of month first date',
          ar: 'سيبدأ تاريخ البدء في الشهر الأول من تاريخه'
        }
      })
      return
    } 
  }catch(e){
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});

  }
}


exports.testApi = async(req, res)=> {
  try {
    await mail.test()
    res.send('done')
  } catch (e) {
    console.log({e})
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
}