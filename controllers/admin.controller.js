const fs = require('fs');
const image = require("../DOM/image.dom");
const company = require("../DOM/company.dom");
const solution = require("../DOM/solution.dom");
const user = require("../DOM/users.dom");
const car = require("../DOM/car.dom");
const carAndGas = require("../DOM/gas_company.dom");
const branch = require("../DOM/branch.dom");
let db = require("../models/index");
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize
const constant = require("../utils/constant");
const {emailsend} = require("../utils/helper");
const moment = require('moment') 
const adminTransaction = require('../DOM/admin-transaction.dom')
const invoice = require('../DOM/invoice.dom')
let  mail = require('../utils/email')
let  vatInvoice = require('../DOM/vat_invoice.dom')
const { USER_TYPE } = require("../utils/constant");







const network = require("../DOM/network.dom");
const {bulCreateRecord} = require("../DOM/network.dom");

const parnter = require("../DOM/partner.dom");
const about = require("../DOM/about.dom");
const price = require("../DOM/price.dom");
const home = require("../DOM/homepage.dom");
const contactUs = require('../DOM/contactus.dom')
const privacy = require('../DOM/privacy.dom')
const getInTouch = require('../DOM/getInTouch.dom')
const notification = require('../DOM/notification.dom')
const FuelPrice = require('../DOM/fuel_price.dom')
const city = require('../DOM/city.dom')
const district = require('../DOM/district.dom')
const year = require('../DOM/year.dom')
const carType = require('../DOM/carType.dom')
const brand = require('../DOM/brand.dom')
const support = require('../DOM/support.dom')
const stationEmp = require('../DOM/stationEmp.dom')
const package = require('../DOM/package.dom')
const defaultFee = require('../DOM/default_fee.dom')
const adminAmountTransfer = require('../DOM/admin-transaction.dom')
const transaction = require('../DOM/transaction.dom')
const payment = require('../DOM/payment.dom')
let dbConfig = require('../config/db.config')


const csv=require('csvtojson');




const { fileUpload, fileUploadPdf, csvUpload, getCommission } = require("../utils/helper");
const helper = require("../utils/helper");
let generator = require('generate-password');
let password = generator.generate({
	length: 10,
	numbers: true
});


exports.addCompany = async (req, res) => {
  try {
    let body = req.body;
    let data = await company.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.addPartnerImage = async (req, res) => {
  try {
    let imageFile = req.files.file;
    let imageName = new Date().getTime() / 1000;
    await fileUpload(imageFile, imageName);
    let body = req.body;
    body.image_path = `./images/${imageName}.jpg`;
    let data = await parnter.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.listPartnerImage = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query = {};
    let data = await parnter.findAndCount(query);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getPartner = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      partner_id: id,
    };
    let data = await parnter.singleRecord(query);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.updatePartner = async (req, res) => {
  try {

    let id = req.params.id;
    let body = req.body;
    let imageName = new Date().getTime() / 1000;
    //checkExits
    let singleData = {
      parter_id: id,
    };

    let partnerObj = await parnter.singleRecord(singleData);
    if (!partnerObj) {
      res.status(400).json("Data not found");
      return;
    }
    if (req.files && (req.files.file !== undefined || req.files.file !== null)) {
      let image = req.files.file
      await fileUpload(image, imageName);
      body.image_path = `./images/${imageName}.jpg`;
    }
    // if (req.files.file) {

    // }
    let query = {
      where: {
        partner_id: id
      }
    };
    await parnter.updateRecord(body, query);
    res.send("Record updated");
    return;
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.deletePartner = async (req, res) => {
  try {
    let id = req.params.id;
    //checkExits
    let query = {
      where: {partner_id: id},
    };

    let partnerObj = await parnter.singleRecord(query);
    if (!partnerObj) {
      res.status(400).json("Data not found");
      return;
    }
    await parnter.deleteUser(query);
    res.send("Record deleted");
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.updateCompany = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        company_id: id,
      },
    };
    let checkingObj = await company.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await company.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.listCompany = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = parseInt(body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = parseInt(body.offset) == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
          description: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let companyData = await company.findAllcompany(query2);
    let count = await company.recordCount({where: query2.where})
    if (companyData.length) {
      let resp = {
        data: companyData,
        count: count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getCompany = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        company_id: id,
      },
    };
    let getData = await company.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        company_id: id
      },
    };
    let getData = await company.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send("Record deleted successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.addSolution = async (req, res) => {
  try {
    let body = req.body;
    let data = await solution.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.updateSolution = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        solution_id: id,
      },
    };
    let checkingObj = await solution.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await solution.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.listSolution = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = parseInt(body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = parseInt(body.offset) == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
          description: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let solutionData = await solution.findAllsolution(query2);
    let count = await solution.recordCount({where:query2.where});

    if (solutionData.length) {
      let resp = {
        data: solutionData,
        count
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getSolution = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        solution_id: id,
      },
    };
    let getData = await solution.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deleteSolution = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        solution_id: id,
      },
    };
    let getData = await solution.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await solution.deleteRecord(query);
    res.send({message: 'Record deleted successfully'})
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    let imageFile = req.files.file;
    let imageName = new Date().getTime() / 1000;
    imageFile.mv(`./public/images/${imageName}.jpg`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
    let body = {
      path: `./images/${imageName}.jpg`,
      image_for: req.body.image_for,
    };
    let data = await image.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.imageList = async (req, res) => {
  try {
    let images = await image.findAllimages();
    res.send(images)
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.updateImage = async (req, res) => {
  try {
    let id = req.params.id
    let body = req.body
    let query = {
      where: {
        image_id: id
      }
    }
    let imageObj = await image.singleRecord(query)
    if (!imageObj) {
      res.send('Record nor exist')
    }
    let path = imageObj.path.split('/')
    if (req.files && (req.files.file !== undefined || req.files.file !== null)) {
      fs.unlinkSync(`./public/images/${path[2]}`);
      let image = req.files.file
      let imageName = new Date().getTime() / 1000;
      await fileUpload(image, imageName);
      body.path = `./images/${imageName}.jpg`;
    }
    await image.updateRecord(body, query)
    res.send('Record update successfully')
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
}

exports.deleteImage = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        image_id: id
      }
    }
    let imageObj = await image.singleRecord(query)
    if (!imageObj) {
      res.send('Record nor exist')
      return
    }
    if(imageObj.path) {
      let path = imageObj.path.split('/')
      if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
    }
    await image.deleteRecord(query)
    res.send('record deleted successfully')
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
}
exports.getImage = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        image_id: id
      }
    }
    let imageObj = await image.singleRecord(query)
    if (!imageObj) {
      res.send('Record nor exist')
    }
    res.send(imageObj)
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
}



exports.userList = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
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
          company_name: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
        user_type: constant.USER_TYPE.user,

      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["password"],
      },
    };
    let userData = await user.findAndCount(query2);
    console.log("Data ==>", userData);
    if (userData && userData.rows.length) {
      let resp = {
        data: userData.rows,
        count: userData.rows.length,
        pageNo: body.limit || 1,
        allCount: userData.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.userDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        user_id: id,
        user_type: constant.USER_TYPE.user,
      },
      attributes: {
        exclude: ["password"],
      },
    };
    let data = await user.singleRecord(query);
    if (!data) {
      res.send(400).json("user not found");
    }
    res.send(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.userUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    delete body.password;
    let queryObject = {
      where: {
        user_id: id,
        user_type: constant.USER_TYPE.user,
      },
    };
    let userObj = await user.singleRecord(queryObject);
    if (!userObj) {
      res.status(400).json("user not exits");
      return;
    }
    if (req.files && req.files.profile_pic) {
      let profile = req.files.profile_pic
      let proTime = new Date().getTime() / 1000;
      await fileUpload(profile, `${proTime}profile`);
      body.profile_pic = `./images/${proTime}profile.jpg`;
      if (userObj.profile_pic) {
        let path = userObj.profile_pic.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.vat_registration_certificate) {
      let vat = req.files.vat_registration_certificate
      let vatTime = new Date().getTime() / 1000;
      await fileUploadPdf(vat, `${vatTime}vat`);
      body.vat_registration_certificate = `./pdf/${vatTime}vat.pdf`;
      if (userObj.vat_registration_certificate) {
        let path = userObj.vat_registration_certificate.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
    }
    if (req.files && req.files.company_logo) {
      let logo = req.files.company_logo
      let logoTime = new Date().getTime() / 1000;
      await fileUpload(logo, `${logoTime}logo`);
      body.company_logo = `./images/${logoTime}logo.jpg`;
      if (userObj.company_logo) {
        let path = userObj.company_logo.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.commercial_registration_certificate) {
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./pdf/${pathTime}commercial_registration_certificate.pdf`;
      if (userObj.commercial_registration_certificate) {
        let path = userObj.commercial_registration_certificate.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
    }
    if (req.files && req.files.bank_account_letterhead) {
      let bank = req.files.bank_account_letterhead
      let bankTime = new Date().getTime() / 1000;
      await fileUploadPdf(bank, `${bankTime}bank_account_letterhead`);
      body.bank_account_letterhead = `./pdf/${bankTime}bank_account_letterhead.pdf`;
      if (userObj.bank_account_letterhead) {
        let path = userObj.bank_account_letterhead.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
    }
    let up = await user.updateRecord(body, queryObject);
    console.log({up})
    if(up[0] === 1 || up[0] === '1') {
      // sending email
      if(body.isApproved){
        await mail.accountApproved(userObj)
      }
    }
    
    res.send("record updated successfully ");
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.empDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        station_id: id,
      },
      include: [
        {
          model: db.gasCompany,
          as: "companyDetails",
        }
      ],
      
    };
    let data = await stationEmp.singleRecord(query);
    if (!data) {
      res.status(400).json("station emp not found");
    }
    data = data.toJSON(data)
    if(data.station_password_plain){
      delete data.station_password_plain
    }
    if(data.supervisor_password_plain){
      delete data.supervisor_password_plain
    }
    if(data.supervisor_password){
      delete data.supervisor_password
    }
    if(data.password){
      delete data.password
    }
    res.send(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.empUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let stationPlanPassword
    let superVisorPlanPassword

    
    if (body.password) {
      stationPlanPassword = req.body.password
      body.station_password_plain = stationPlanPassword
      delete body.password

    }
    if (body.supervisor_password) {
      superVisorPlanPassword = req.body.supervisor_password
      delete body.supervisor_password

      // body.supervisor_password = await helper.createPassword(body.supervisor_password);
    }
    if (body.fuel_type && body.fuel_type.length) {
      body.fuel_type_id =  body.fuel_type.toString();
    }
    let queryObject = {
      where: {
        station_id: id,
      }
    };

    // check user exiits or not
    let empObj = await stationEmp.singleRecord(queryObject);
    
    if (!empObj) {
      res.status(400).json("employee not exits");
      return;
    }
    let updateStationDetail = await stationEmp.updateRecord(body, queryObject);
    if(updateStationDetail[0] === 1) {
      if(stationPlanPassword && superVisorPlanPassword) {
        let getAll = await stationEmp.findAllUsers({where: {email: empObj.email}});
        getAll = JSON.parse(JSON.stringify(getAll))
        console.log(getAll[0].station_id)

        await stationEmp.updateRecord({supervisor_password_plain: superVisorPlanPassword,
           supervisor_password: await helper.createPassword(superVisorPlanPassword)}, {where: {station_id: getAll[0].station_id}});

           await stationEmp.updateRecord({station_password_plain: stationPlanPassword,password: await helper.createPassword(stationPlanPassword)},
            queryObject);
           let updatedDetails = await stationEmp.singleRecord(queryObject);
         
        await mail.updateGasStation(updatedDetails, updatedDetails, updatedDetails.station_password_plain, superVisorPlanPassword)
      } else if (stationPlanPassword) {
        let getAll = await stationEmp.findAllUsers({where: {email: empObj.email}});
        getAll = JSON.parse(JSON.stringify(getAll))

        await stationEmp.updateRecord({station_password_plain: stationPlanPassword,password: await helper.createPassword(stationPlanPassword)},
            queryObject);

           let updatedDetails = await stationEmp.singleRecord(queryObject);

        await mail.updateGasStation(updatedDetails, updatedDetails, updatedDetails.station_password_plain, getAll[0].supervisor_password_plain)
      } else if(superVisorPlanPassword){
        let getAll = await stationEmp.findAllUsers({where: {email: empObj.email}});
        getAll = JSON.parse(JSON.stringify(getAll))

        await stationEmp.updateRecord({supervisor_password_plain: superVisorPlanPassword,
          supervisor_password: await helper.createPassword(superVisorPlanPassword)}, {where: {station_id: getAll[0].station_id}});
           
           let updatedDetails = await stationEmp.singleRecord(queryObject);
         
        await mail.updateGasStation(updatedDetails, updatedDetails, updatedDetails.station_password_plain, superVisorPlanPassword)
      }
    }
    if(body.isActive === false || body.isActive === 'false') {
      await network.updateRecord({isActive: body.isActive}, queryObject)
    } 
    if(body.isActive) {
      await network.updateRecord({isActive: body.isActive}, queryObject)
    }
    if(body.company_id) {
      await network.updateRecord({company_id: body.company_id}, queryObject)
    }
    res.send("record updated successfully ");
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.empList = async (req, res) => {
  try {
    let body = req.query;
    let where 
    if(!body.search_key && !body.company_id) {
      where = {}
    } else if(body.search_key && body.company_id) {
      where = {
        [Op.or]: {
          supervisor_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          email: {
            [Op.like]: `%${body.search_key}%`,
          },
          station_name: {
            [Op.like]: `%${body.search_key}%`,
          }
        },
        company_id: body.company_id,
      }
    } else if(body.company_id) {
      where = {company_id: body.company_id}
    } else {
      where =  {
        [Op.or]: {
          supervisor_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          email: {
            [Op.like]: `%${body.search_key}%`,
          },
          station_name: {
            [Op.like]: `%${body.search_key}%`,
          }
        },
      }
    }
    body.limit = parseInt(body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = parseInt(body.offset) == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where,
      include: [
        {
          model: db.gasCompany,
          as: "companyDetails",
        },
      ],
      limit: body.limit,
      offset: body.offset,
      order: [["station_id", "DESC"]],

    };
    let userData = await stationEmp.findAllUsers(query2);
    let count = await stationEmp.recordCount({where: query2.where});
    userData = JSON.parse(JSON.stringify(userData))
    if (userData && userData.length) {
      for (let i = 0; i < userData.length; i++) {
        let array = [] 
        if (userData[i].fuel_type_id) {
          let arr = userData[i].fuel_type_id.split(',')
          for (let j = 0; j < arr.length; j++) {
            let fuel_typeData = await FuelPrice.singleRecord({where: {fuel_price_id: arr[j]}})
            if(fuel_typeData) {
              array.push(fuel_typeData) 
              userData[i].fuelTypes = array
            }    
          }
        }
        if(userData[i].station_password_plain){
          delete userData[i].station_password_plain
        }
        if(userData[i].supervisor_password_plain){
          delete userData[i].supervisor_password_plain
        }
        if(userData[i].supervisor_password){
          delete userData[i].supervisor_password
        }
        if(userData[i].password){
          delete userData[i].password
        }
      }
    }
    let resp = {
      data: userData,
      count,
    };
    res.send(resp)
  } catch (error) {
    console.log({error})
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.emp = async (req, res) => {
  try {
    let body = req.body;
    if(body.fuel_type.length) {
      body.fuel_type_id = body.fuel_type.toString();
    }
    let query = {};
    query.where = {
      email: body.email,
    };
    let emailChecking = await stationEmp.findAllUsers(query);

    let plainPassword
    let password = generator.generate({
        length: 10,
        numbers: true
      });
      plainPassword =  body.password
      body.station_password_plain = body.password
      body.password = await helper.createPassword(plainPassword);
      emailChecking = JSON.parse(JSON.stringify(emailChecking))
    if (emailChecking.length) {
    } else {
      let password = generator.generate({
        length: 10,
        numbers: true
      });
      console.log(body)
      let lastFourDigits = body.mobile_no.substr(-4);
      body.supervisor_password_plain =  lastFourDigits
      body.supervisor_password = await helper.createPassword(body.supervisor_password_plain);
      // body.supervisor_password_plain =  password
      // body.supervisor_password = await helper.createPassword(body.supervisor_password_plain);
    }
    let station = await stationEmp.createRecord(body);
    station = station.toJSON();
    let bodyDataForNetwork = {
      company_id: parseInt(station.company_id),
      station_id: parseInt(station.station_id)
    }
      await network.createRecord(bodyDataForNetwork)
    if(station.supervisor_password_plain && station.supervisor_password) {
      await mail.newGasStation(body, station, plainPassword, body.supervisor_password_plain)
    } else {
      await mail.newGasStation(body, station, plainPassword, emailChecking[0].supervisor_password_plain)
    }
    delete station.password;
    delete station.supervisor;
    res.send(station);
  } catch (e) {
    console.log({ e })
    res.status(500).json("Server side error")
  }
}

exports.empDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        station_id: id,
      },
    };
    let data = await stationEmp.singleRecord(query);
    if (!data) {
      res.status(400).json("station emp not found");
    }
    if(parseFloat(data.credit) > 0) {
      res.status(400).json({message: 'please make balance zero before delete'})
      return
    }
    await stationEmp.deleteUser(query);
    await network.deleteRecord(query)
    res.json("deleted successfully");
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.carDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        car_id: id,
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
          model: db.user,
          as: "userDetails",
          attributes: { exclude: ["password"] },
        },
        {
          model: db.branch,
          as: "BranchDeytails",
        }
      ]
    };
    let data = await car.singleRecord(query);
    if (!data) {
      res.send(400).json("car not found");
    }
    res.send(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.carDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        car_id: id,
      },
    };
    let data = await car.singleRecord(query);
    if (!data) {
      res.status(400).json("car not found");
    }
    await car.removeRecord(query);
    res.json("deleted successfully");
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.carList = async (req, res) => {
  try {
    let body = req.query;
    let where = {}
    if(!body.search_key && !body.user_id) {
      where = {}
    } else if(body.search_key && body.user_id) {
      where = {
        [Op.or]: {
          car_plate: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
        user_id: body.user_id
      }
    } else if(body.user_id) {
      where = {user_id: body.user_id}
    } else {
      where =  {
        [Op.or]: {
          car_plate: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      }
    }

    body.limit = body.limit == undefined ? 10 : body.limit;
    body.offset = body.offset == undefined ? 0 : body.offset;
    let query = {
      limit: body.limit,
      offset: body.offset,
      // where: {
      //   [Op.or]: {
      //     car_plate: {
      //       [Op.like]: `%${body.search_key}%`,
      //     },
      //   },
      // },
      where,
      include: [
        {
          model: db.branch,
          as: "BranchDeytails",
          include: [
            {
              model: db.city,
              as: "cityData",
            },
            {
              model: db.district,
              as: "districtData",
            },
          ]
        },
        {
          model: db.user,
          as: "userDetails",
          attributes: { exclude: ["password"] },
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
          model: db.carType,
          as: "carTypeDetails",
        },
        {
          model: db.fuelPrice,
          as: "fuelTypeDetails",
        },
      ],
      order: [["car_id", "DESC"]],
    };
    let result = await car.findAndCount(query);
    if (result) {
      let resp = {
        data: result.rows,
        allCount: result.count
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};
exports.carUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    if(body.credit) {
      delete body.credit;
    }
    let query = {
      where: {
        car_id: id,
      },
    };
    let carD = await car.singleRecord(query)
    if(!carD) {
      res.status(400).json({message: 'car not exixts'})
      return
    } 
    // carD = JSON.parse(JSON.stringify(carD))
    // console.log(carD)
    // if(carD.credit === null || carD.credit === 'null') {
    //   carD.credit = 0
    // }
    // console.log(carD, 'after')


    let carU = await car.updateRecord(body, query);
    if(carU[0] === 1) {
      let branchObj
      if(body.isActive === false || body.isActive === 0) {
        branchObj  = await branch.singleRecord({where: {branch_id: carD.branch_id}})
        if(branchObj){
          let total = parseFloat(carD.credit ? carD.credit : 0)+parseFloat(branchObj.credit ? branchObj.credit : 0)
          if(total > 0) {
            await branch.updateRecord({credit: total}, {where: {isActive : true, branch_id: carD.branch_id}})
            await car.updateRecord({credit: 0}, {where: {car_id: id}})
        }

      }
      }
    }
    res.json("updated successfully");
  } catch (error) {
    console.log({error})
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.branchDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        branch_id: id,
      },
      include: [
        {
          model: db.car,
          as: "carDetails",
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
            }
          ]
        },
        {
          model: db.user,
          as: "userDetails",
          attributes: { exclude: ["password"] },
        },
        {
          model: db.city,
          as: "cityData",
        },
        {
          model: db.district,
          as: "districtData",
        },
      ],
    };
    let data = await branch.singleRecord(query);
    if (!data) {
      res.send(400).json("branch not found");
    }
    res.send(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.branchDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        branch_id: id,
      },
    };
    let data = await branch.singleRecord(query);
    if (!data) {
      res.status(400).json("branch not found");
    }
    await branch.removeRecord(query);
    await car.removeRecord(query);

    res.json("deleted successfully");
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.branchUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    delete body.credit;
    let query = {
      where: {
        branch_id: id,
      },
    };
    let branchData = await branch.singleRecord(query)
    if(branchData) {
      let checkBranch = await branch.updateRecord(body, query);
      if(checkBranch[0] === 1) {
        if(req.body.isActive === false || req.body.isActive === 0) {
          // get all car credit sum associate with with branch this branc
          let queryObject = {
            where: {
              user_id: branchData.user_id,
              branch_id: branchData.branch_id
            },
          }
          let sum  =  await car.findAllcars({
            where: queryObject.where,
            attributes: [
              [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
          ]
          })
          sum = JSON.parse(JSON.stringify(sum))
          let userD = await user.singleRecord({where:{user_id: branchData.user_id}})
          let sumAmount = 0
          
          sumAmount = parseFloat(sumAmount) + parseFloat(branchData.credit ? branchData.credit: 0 )
          sumAmount = parseFloat(sumAmount) + parseFloat(sum[0].credit ? sum[0].credit : 0)
          sumAmount = parseFloat(sumAmount) + parseFloat(userD.credit ? userD.credit : 0)
          if(sumAmount > 0) {
            await user.updateRecord({credit: sumAmount}, {where: {user_id: branchData.user_id}})
            await branch.updateRecord({credit: 0}, queryObject)
            await car.updateRecord({credit: 0, isActive: false}, queryObject)
          } 
        }
      }
    }
    res.json("updated successfully");
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.branchList = async (req, res) => {
  try {
    let body = req.query;
    let where 
    if(!body.search_key && !body.user_id) {
      where = {}
    } else if(body.search_key && body.user_id) {
      where = {
        [Op.or]: {
          branch_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          branch_manager: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
        user_id: body.user_id,
      }
    } else if(body.user_id) {
      where = {user_id: body.user_id}
    } else {
      where =  {
        [Op.or]: {
          branch_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          branch_manager: {
            [Op.like]: `%${body.search_key}%`,
          },
        }
      }
    }
    body.limit = parseInt(body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = parseInt(body.offset) == undefined ? 0 : parseInt(body.offset);
    let query = {
      // where: {
      //   [Op.or]: {
      //     branch_name: {
      //       [Op.like]: `%${body.search_key}%`,
      //     },
      //     branch_manager: {
      //       [Op.like]: `%${body.search_key}%`,
      //     },
      //   },
      // },
      where,
      include: [
        {
          model: db.car,
          as: "carDetails",
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
        },
        {
          model: db.user,
          as: "userDetails",
          attributes: { exclude: ["password"] },
        },
        {
          model: db.city,
          as: "cityData",
        },
        {
          model: db.district,
          as: "districtData",
        },
      ],

      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let result = await branch.findAndCount(query);
    let branchCount = await branch.recordCount({where: where})
    if (result && result.rows.length) {
      let resp = {
        allCount: branchCount,
        data: result.rows,
      };
      res.send(resp);
      return;
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.addNetwork = async (req, res) => {
  try {
    let body = req.body;
    let data = await network.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.updateNetwork = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    if(body.company_id) {
      delete body.company_id
    }
    let query = {
      where: {
        network_id: id,
      },
    };
    let checkingObj = await network.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await network.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.listNetwork = async (req, res) => {
  try {
    let body = req.query;
    let whereData = {}
    if (body.station_id && body.company_id) {
      whereData.station_id = body.station_id
      whereData.company_id = body.company_id
    } else if(body.company_id) {
      whereData.company_id = body.company_id
    } else if(body.station_id) {
      whereData.station_id = body.station_id
    }
    body.limit = parseInt(body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = parseInt(body.offset) == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: whereData,
      // {
        // [Op.or]: {
        //   gas_station_name: {
        //     [Op.like]: `%${body.search_key}%`,
        //   }
        // },
      // },
      include: [{
        model: db.gasCompany,
        as: 'gasStationDetails',
        attributes: ['company_name']
      },  {
        model: db.station_emp,
        as: 'stationEmpDetails',
        attributes: ['station_id','supervisor_name', 'lat', 'long', 'fuel_type_id', 'station_name']
      }
    ],
      limit: body.limit,
      offset: body.offset,
      order: [["network_id", "DESC"]],
    };
    let networkData = await network.findAndCount(query2);
    networkData = JSON.parse(JSON.stringify(networkData))
    // res.send(networkData)
    if (networkData && networkData.rows.length) {
      for (let i = 0; i < networkData.rows.length; i++) {
        let array = [] 
        if (networkData.rows[i].stationEmpDetails && networkData.rows[i].stationEmpDetails.fuel_type_id) {
          let arr = networkData.rows[i].stationEmpDetails.fuel_type_id.split(',')
          for (let j = 0; j < arr.length; j++) {
            let fuel_typeData = await FuelPrice.singleRecord({where: {fuel_price_id: arr[j]}})
            if(fuel_typeData) {
              array.push(fuel_typeData) 
              networkData.rows[i].stationEmpDetails.fuelTypes = array
            }    
          }
        }
      }
      let resp = {
        data: networkData.rows,
        count: networkData.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getNetwork = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        network_id: id,
      },
      include: [{
        model: db.gasCompany,
        as: 'gasStationDetails',
        attributes: ['company_name']
      },  {model: db.station_emp,
        as: 'stationEmpDetails',
        attributes: ['supervisor_name', 'lat', 'long']
      }],
    };
    let getData = await network.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deleteNetwork = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        network_id: id,
      },
    };
    let getData = await network.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await network.deleteRecord(query);
    res.json("Record deleted successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.addCarOrGasCompany = async (req, res) => {
  try {

    let body = req.body;
    if (req.files && req.files.profile_pic) {
      let profile = req.files.profile_pic
      let proTime = new Date().getTime() / 1000;
      await fileUpload(profile, `${proTime}profile`);
      body.profile_pic = `./images/${proTime}profile.jpg`;
    }
    if (req.files && req.files.vat_registration_certificate) {
      let vat = req.files.vat_registration_certificate
      let vatTime = new Date().getTime() / 1000;
      await fileUploadPdf(vat, `${vatTime}vat`);
      body.vat_registration_certificate = `./pdf/${vatTime}vat.pdf`;

    }
    if (req.files && req.files.company_logo) {
      let logo = req.files.company_logo
      let logoTime = new Date().getTime() / 1000;
      await fileUpload(logo, `${logoTime}logo`);
      body.company_logo = `./images/${logoTime}logo.jpg`;

    }
    if (req.files && req.files.commercial_registration_certificate) {
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./pdf/${pathTime}commercial_registration_certificate.pdf`;

    }
    if (req.files && req.files.bank_account_letterhead) {
      let bank = req.files.bank_account_letterhead
      let bankTime = new Date().getTime() / 1000;
      await fileUploadPdf(bank, `${bankTime}bank_account_letterhead`);
      body.bank_account_letterhead = `./pdf/${bankTime}bank_account_letterhead.pdf`;

    }
    if (req.files && req.files.commercial_registration_certificate) {
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./pdf/${pathTime}commercial_registration_certificate.pdf`;

    }
    if (req.files && req.files.bank_account_letterhead) {
      let bank = req.files.bank_account_letterhead
      let bankTime = new Date().getTime() / 1000;
      await fileUploadPdf(bank, `${bankTime}bank_account_letterhead`);
      body.bank_account_letterhead = `./pdf/${bankTime}bank_account_letterhead.pdf`;
    }
    let data = await carAndGas.createRecord(body);
    if(data) {
      await mail.newGasComapany(body)
    }
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
 
exports.updateCarOrGasCompany = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        company_id: id,
      },
    };
    let checkingObj = await carAndGas.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    if (req.files && req.files.profile_pic) {
      let profile = req.files.profile_pic
      let proTime = new Date().getTime() / 1000;
      await fileUpload(profile, `${proTime}profile`);
      body.profile_pic = `./images/${proTime}profile.jpg`;
      if (checkingObj.profile_pic) {
        let path = checkingObj.profile_pic.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.vat_registration_certificate) {
      let vat = req.files.vat_registration_certificate
      let vatTime = new Date().getTime() / 1000;
      await fileUploadPdf(vat, `${vatTime}vat`);
      body.vat_registration_certificate = `./pdf/${vatTime}vat.pdf`;
      if (checkingObj.vat_registration_certificate) {
        let path = checkingObj.vat_registration_certificate.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.company_logo) {
      let logo = req.files.company_logo
      let logoTime = new Date().getTime() / 1000;
      await fileUpload(logo, `${logoTime}logo`);
      body.company_logo = `./images/${logoTime}logo.jpg`;
      if (checkingObj.company_logo) {
        let path = checkingObj.company_logo.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.commercial_registration_certificate) {
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./pdf/${pathTime}commercial_registration_certificate.pdf`;
      if (checkingObj.commercial_registration_certificate) {
        let path = checkingObj.commercial_registration_certificate.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
    }
    if (req.files && req.files.bank_account_letterhead) {
      let bank = req.files.bank_account_letterhead
      let bankTime = new Date().getTime() / 1000;
      await fileUploadPdf(bank, `${bankTime}bank_account_letterhead`);
      body.bank_account_letterhead = `./pdf/${bankTime}bank_account_letterhead.pdf`;
      if (checkingObj.bank_account_letterhead) {
        let path = checkingObj.bank_account_letterhead.split('/')
        if (fs.existsSync(`./public/pdf/${path[2]}`)) fs.unlinkSync(`./public/pdf/${path[2]}`);
      }
    }
    await carAndGas.updateRecord(body, query);
    if(body.isActive === false || req.body.isActive === 'false' || req.body.isActive === 0){
      await stationEmp.updateRecord({isActive: body.isActive}, query);
      await network.updateRecord({isActive: body.isActive}, query);
    }
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.listCarOrGasCompany = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          f_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          company_name: {
            [Op.like]: `%${body.search_key}%`,
          },
          email: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let networkCarOrGasCompany = await carAndGas.findAllGasCompany(query2);
    let count = await carAndGas.recordCount({where: query2.where});

    if (networkCarOrGasCompany.length) {
      let resp = {
        data: networkCarOrGasCompany,
        count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getCarOrGasCompany = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        company_id: id,
      },
    };
    let getData = await carAndGas.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deleteCarOrGasCompany = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        company_id: id,
      },
    };
    let getData = await carAndGas.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    let allEmp = await stationEmp.findAllUsers(query)
    allEmp = JSON.parse(JSON.stringify(allEmp))
    if(allEmp.length) {
      let isHaveCredit = false
      for (let i = 0; i < allEmp.length; i++) {
        if(allEmp[i].credit === '0.00' || allEmp[i].credit === null) {
          
        } else {
          isHaveCredit = true
          break;
        }        
      }
      if(isHaveCredit) {
        return res.status(400).json("please clear all employee account balance")
      }
    }
      await carAndGas.deleteRecord(query);
      await stationEmp.deleteUser(query);

    return res.send("Record deleted successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.addAbout = async (req, res) => {
  try {
    let body = req.body;
    let data = await about.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.updateAbout = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        about_id: id,
      },
    };
    let checkingObj = await about.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await about.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.listAbout = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let aboutList = await about.findAndCount(query2);
    if (aboutList) {
      let resp = {
        data: aboutList.rows,
        count: aboutList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getAbout = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        about_id: id,
      },
    };
    let getData = await about.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deleteAbout = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        about_id: id,
      },
    };
    let getData = await about.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await about.deleteRecord(query);
    res.json("Record deleted successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.addPrice = async (req, res) => {
  try {
    let body = req.body;
    let data = await price.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.updatePrice = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        price_id: id,
      },
    };
    let checkingObj = await price.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await price.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.listPrice = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let priceList = await price.findAndCount(query2);
    if (priceList) {
      let resp = {
        data: priceList.rows,
        count: priceList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getPrice = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        price_id: id,
      },
    };
    let getData = await price.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deletePrice = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        price_id: id,
      },
    };
    let getData = await price.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await price.deleteRecord(query);
    res.json("Record deleted successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.addHome = async (req, res) => {
  try {
    let body = req.body;
    let data = await home.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.updateHome = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        home_id: id,
      },
    };
    let checkingObj = await home.singleRecord(query);
    console.log({ checkingObj });
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await home.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};
exports.listHome = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let homeList = await home.findAndCount(query2);
    if (homeList) {
      let resp = {
        data: homeList.rows,
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getHome = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        home_id: id,
      },
    };
    let getData = await home.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.deleteHome = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        home_id: id,
      },
    };
    let getData = await home.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await home.deleteRecord(query);
    res.json("Record deleted successfully");
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};

exports.approvedUser = async (req, res) => {
  try {
    let body = req.body;
    let id = req.params.id
    let query = {
      company_id: id
    };
    await company.updateRecord({ isApproved: body.isApproved }, query)
    res.send('record updated')
  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
};


exports.updateCompanyProfile = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        company_id: id
      }
    }
    let body = req.body
    let obj = await carAndGas.singleRecord(query)
    if (!obj) {
      res.send('User not exist')
      return
    }
    if (req.files && req.files.profile_pic) {
      let profile = req.files.profile_pic
      let proTime = new Date().getTime() / 1000;
      await fileUpload(profile, `${proTime}profile`);
      body.profile_pic = `./images/${proTime}profile.jpg`;
      console.log('========', obj)


      if (obj.profile_pic) {
        let path = obj.profile_pic.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.vat_registration_certificate) {
      let vat = req.files.vat_registration_certificate
      let vatTime = new Date().getTime() / 1000;
      await fileUpload(vat, `${vatTime}vat`);
      body.vat_registration_certificate = `./images/${vatTime}vat.jpg`;
      if (obj.vat_registration_certificate) {
        let path = obj.vat_registration_certificate.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.company_logo) {
      let logo = req.files.company_logo
      let logoTime = new Date().getTime() / 1000;
      await fileUpload(logo, `${logoTime}logo`);
      body.company_logo = `./images/${logoTime}logo.jpg`;
      if (obj.company_logo) {
        let path = obj.company_logo.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }
    if (req.files && req.files.commercial_registration_certificate) {
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUpload(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./images/${pathTime}commercial_registration_certificate.jpg`;
      if (obj.commercial_registration_certificate) {
        let path = obj.commercial_registration_certificate.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }

    if (req.files && req.files.bank_account_letterhead) {
      let bank = req.files.bank_account_letterhead
      let bankTime = new Date().getTime() / 1000;
      await fileUpload(bank, `${bankTime}bank_account_letterhead`);
      body.bank_account_letterhead = `./images/${bankTime}bank_account_letterhead.jpg`;
      if (obj.bank_account_letterhead) {
        let path = obj.bank_account_letterhead.split('/')
        if (fs.existsSync(`./public/images/${path[2]}`)) fs.unlinkSync(`./public/images/${path[2]}`);
      }
    }


    await carAndGas.updateRecord(body, query)
    res.send("profile is updated")

  } catch (error) {
    res.status(500).json(`Error ${error}`);
  }
}

exports.addContact = async (req, res) => {
  try {
    req.body.status = 'pending'
    let obj = await contactUs.createRecord(req.body);
    if(obj) {
      let data = `<!DOCTYPE html>
        <html>
        <head>
          <title></title>
        </head>
        <body>
          <p>Dear ${body.name},</p>
          <p>Thanks for contact us. We will revert you shortly.</p>
        </body>
        </html>`
        let object = {
          to: userObj.email,
          subject: "New enquery",
          // text: `,
           html: data
        };
        await emailsend(object)
    }
    res.json("data sucessfully saved");
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.updateContact = async (req, res) => {
  try {
    let id = req.params.id
    let contactObj = await contactUs.singleRecord({ where: { contact_id: id } })
    if (!contactObj) {
      res.send('Record not exits')
      return
    }
    let success = await contactUs.updateRecord(req.body, { where: { contact_id: id } });
    if (success.length) {
      res.json("Record updated sucessfully");
      return
    } else {
      res.json("Some thing went wrong");
      return
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.deleteContact = async (req, res) => {
  try {
    let id = req.params.id
    let contactObj = await contactUs.singleRecord({ where: { contact_id: id } })
    if (!contactObj) {
      res.send('Record not exits')
      return
    }
    await contactUs.deleteRecord({ where: { contact_id: id } });
    res.send('Record deleted successfuly')

  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.getContact = async (req, res) => {
  try {
    let id = req.params.id
    let contactObj = await contactUs.singleRecord({ where: { contact_id: id } })
    if (!contactObj) {
      res.send('Record not exits')
      return
    }
    res.send(contactObj)
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.listContact = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
          email: {
            [Op.like]: `%${body.search_key}%`,
          },
          type: {
            [Op.like]: `%${body.search_key}%`,
          },
          status: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
        status: body.status
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let homeList = await contactUs.findAndCount(query2);
    if (homeList) {
      let resp = {
        data: homeList.rows,
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};


exports.addPrivacy = async (req, res) => {
  try {
    let imageFile = req.files.file;
    let imageName = new Date().getTime() / 1000;
    await fileUploadPdf(imageFile, imageName);
    let body = req.body;
    body.path = `./pdf/${imageName}.pdf`;
    let data = await privacy.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.updatePrivacy = async (req, res) => {
  try {
    let id = req.params.id
    let privacyObj = await privacy.singleRecord({ where: { privacy_id: id } })
    if (!privacyObj) {
      res.send('Record not exits')
      return
    }
    if (req.files && req.files.file) {
      let path = req.files.file
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, pathTime);
      req.body.path = `./pdf/${pathTime}.pdf`;
      if (privacyObj.path) {
        let pathSplit = privacyObj.path.split('/')
        console.log(`111111111111111111`, pathSplit)
        if (fs.existsSync(`./public/pdf/${pathSplit[2]}`)) fs.unlinkSync(`./public/pdf/${pathSplit[2]}`);
      }
    }
    let success = await privacy.updateRecord(req.body, { where: { privacy_id: id } });
    if (success.length) {
      res.json("Record updated sucessfully");
      return
    } else {
      res.json("Some thing went wrong");
      return
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.deletePrivacy = async (req, res) => {
  try {
    let id = req.params.id
    let privacyObj = await privacy.singleRecord({ where: { privacy_id: id } })
    if (!privacyObj) {
      res.send('Record not exits')
      return
    }
    await privacy.deleteRecord({ where: { privacy_id: id } });
    res.send('Record deleted successfuly')

  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.getPrivacy = async (req, res) => {
  try {
    let id = req.params.id
    let privacyObj = await privacy.singleRecord({ where: { privacy_id: id } })
    if (!privacyObj) {
      res.send('Record not exits')
      return
    }
    res.send(privacyObj)
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.listPrivacy = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
          description: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let homeList = await privacy.findAndCount(query2);
    if (homeList) {
      let resp = {
        data: homeList.rows,
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

// 
exports.addGetInTouch = async (req, res) => {
  try {
    let body = req.body
    let data = await getInTouch.createRecord(body);
    res.send(data);
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.updateGetInTouch = async (req, res) => {
  try {
    let id = req.params.id
    let Obj = await getInTouch.singleRecord({ where: { id: id } })
    if (!Obj) {
      res.send('Record not exits')
      return
    }
    let success = await getInTouch.updateRecord(req.body, { where: { id: id } });
    if (success[0] === 1) {
      res.json("Record updated sucessfully");
      return
    } else {
      res.json("Some thing went wrong");
      return
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.deleteGetInTouch = async (req, res) => {
  try {
    let id = req.params.id
    let Obj = await getInTouch.singleRecord({ where: { id: id } })
    if (!Obj) {
      res.send('Record not exits')
      return
    }
    await getInTouch.deleteRecord({ where: { id: id } });
    res.send('Record deleted successfuly')

  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.getGetInTouch = async (req, res) => {
  try {
    let id = req.params.id
    let Obj = await getInTouch.singleRecord({ where: { id: id } })
    if (!Obj) {
      res.send('Record not exits')
      return
    }
    res.send(Obj)
  } catch (error) {
    console.log({ error });
    res.status(500).json("Error: " + error);
  }
};

exports.listGetInTouch = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          company_address: {
            [Op.like]: `%${body.search_key}%`,
          },
          email: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["updatedAt", "DESC"]],
    };
    let homeList = await getInTouch.findAndCount(query2);
    if (homeList) {
      let resp = {
        data: homeList.rows,
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};


exports.addNotification = async (req, res) => {
  try {
    let body = req.body
    let notificationObj = await notification.createRecord(body);
    res.send(notificationObj)
  } catch (e) {
    console.log({ e }),
      res.status(500).json("Server side error")
  }
}

exports.updateNotification = async (req, res) => {
  try {
    let id = req.params.id
    let body = req.body
    let query = {
      where: {
        notification_id: id
      }
    }
    // check notification 
    let check = await notification.singleRecord(query)
    if (!check) {
      res.status(400).json('Record not exists')
      return
    }
    let notificationObj = await notification.updateRecord(body, query);
    if (notificationObj.length && notificationObj[0] === 1) {
      res.send("Record update successfully")
      return
    } else {
      res.send("Some thing went wrong with Update")
      return
    }
  } catch (e) {
    console.log({ e }),
      res.status(500).json("Server side error")
  }
}
exports.getNotification = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        notification_id: id
      },
    }
    // check notification 
    let check = await notification.singleRecord(query)
    if (!check) {
      res.status(400).json('Record not exists')
      return
    }
    res.send(check)
  } catch (e) {
    console.log({ e })
    res.status(500).json("Server Side Error")
  }
}

exports.deleteNotification = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        notification_id: id
      }
    }
    // check notification 
    let check = await notification.singleRecord(query)
    if (!check) {
      res.status(400).json('Record not exists')
      return
    }
    await notification.deleteRecord(query);
    res.send("Successfully Deleted")

  } catch (e) {
    console.log({ e }),
      res.status(500).json("Server side error")
  }
}
exports.listNotification = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${body.search_key}%`,
          },
          description: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["notification_id", "DESC"]],
    };
    let homeList = await notification.findAndCount(query2);
    if (homeList) {
      let resp = {
        data: homeList.rows,
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.listNotificationForAll = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        isActive: true
      },
      limit: body.limit,
      offset: body.offset,
      order: [["notification_id", "DESC"]],
    };
    let homeList = await notification.findAndCount(query2);
    if (homeList) {
      let resp = {
        data: homeList.rows,
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.addFuelPrice = async (req, res) => {
  try {
    let body = req.body
    if (body.vat) {
      let vatRecord = await FuelPrice.findAllRecord({
        where: {
          vat: {
            [Op.not]: null, // Like: IS NOT NULL
          },
        }
      })
      if (vatRecord && vatRecord.length) {
        delete body.vat
      }
    }
    let fuelPriceObj = await FuelPrice.createRecord(body);
    res.send(fuelPriceObj)
  } catch (e) {
    console.log({ e }),
      res.status(500).json("Server side error")
  }
}

exports.updateFuelPrice = async (req, res) => {
  try {
    let id = req.params.id
    let body = req.body

    let query = {
      where: {
        fuel_price_id: id
      }
    }
    // check notification 
    let check = await FuelPrice.singleRecord(query)
    if (!check) {
      res.status(400).json('Record not exists')
      return
    }
    if (check.vat) {
      body.vat
    } else {
      delete body.vat
    }
    let fuelPriceObj = await FuelPrice.updateRecord(body, query);
    if (fuelPriceObj.length && fuelPriceObj[0] === 1) {
      res.send("Record update successfully")
      return
    } else {
      res.send("Some thing went wrong with Update")
      return
    }
  } catch (e) {
    console.log({ e }),
      res.status(500).json("Server side error")
  }
}
exports.getFuelPrice = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        fuel_price_id: id
      },
    }
    // check notification 
    let check = await FuelPrice.singleRecord(query)
    if (!check) {
      res.status(400).json('Record not exists')
      return
    }
    res.send(check)
  } catch (e) {
    console.log({ e })
    res.status(500).json("Server Side Error")
  }
}

exports.deleteFuelPrice = async (req, res) => {
  try {
    let id = req.params.id
    let query = {
      where: {
        fuel_price_id: id
      }
    }
    // check notification 
    let check = await FuelPrice.singleRecord(query)
    if (!check) {
      res.status(400).json('Record not exists')
      return
    }
    await FuelPrice.updateRecord({isActive: false}, query);
    res.send("Successfully Deleted")

  } catch (e) {
    console.log({ e }),
      res.status(500).json("Server side error")
  }
}
exports.listFuelPrice = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {

      limit: body.limit,
      offset: body.offset,
      order: [["fuel_price_id", "DESC"]],
    };
    let homeList = await FuelPrice.findAndCount(query2);
    if (homeList && homeList.rows.length) {
      let array = []
      let array2 = []

      for (let i = 0; i < homeList.rows.length; i++) {
        if (homeList.rows[i].vat === null) {

          array.push({
            fuel_price_id: homeList.rows[i].fuel_price_id,
            fuel_type: homeList.rows[i].fuel_type,
            fuel_price: homeList.rows[i].fuel_price,
            isActive: homeList.rows[i].isActive,
            createdAt: homeList.rows[i].createdAt,
            updatedAt: homeList.rows[i].updatedAt,
            deletedAt: homeList.rows[i].deletedAt
          })
        }
        if (homeList.rows[i].vat) {
          array2.push({
            fuel_price_id: homeList.rows[i].fuel_price_id,
            fuel_type: homeList.rows[i].fuel_type,
            fuel_price: homeList.rows[i].fuel_price,
            vat: homeList.rows[i].vat,
            isActive: homeList.rows[i].isActive,
            createdAt: homeList.rows[i].createdAt,
            updatedAt: homeList.rows[i].updatedAt,
            deletedAt: homeList.rows[i].deletedAt
          })
        }

      }


      let resp = {
        data: array,
        vat: array2[0],
        count: homeList.count,
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.addCreditToUser = async (req, res) => {
  try {
    let userId = req.params.id
    //user info
    query = { where: { user: userId, user_type: constant.USER_TYPE.user } }
    let userInfo = await user.singleRecord(query)
    if (!userInfo) {
      res.status(400).json({ message: 'User not found' })
    }
    if (userInfo.credit === null) {
      userInfo.credit === 0
    }
    if (userInfo.credit < body.amount) {
      res.status(400).json({ message: 'Amount should be less then from user credit' })
    }
    let calculatedAmount = parseFloat(userInfo.credit) + parseFloat(body.amount)
    let bodybj = { credit: calculatedAmount }
    let queryForUpdate = { where: { user_id: userId, user_type: constant.USER_TYPE.user } }
    await user.updateRecord(bodybj, queryForUpdate)
    res.send({ message: 'successfully completed' })


  } catch (e) {
    console.log({ e })
    res.status(500).json('Server Side error')
  }
}

exports.addCity = async (req, res) => {
  try {
    let body = req.body
    let cityObject = await city.createRecord(body)
    res.send(cityObject)
  } catch (e) {
    console.log({ e })
    res.status(500).json('Server Side Error')
  }
}

exports.addDistrict = async (req, res) => {
  try {
    let body = req.body
    let districtData = await district.createRecord(body)
    res.send(districtData)
  } catch (e) {
    console.log({ e })
    res.status(500).json('Server Side Error')
  }
}
exports.getCityFromDistrict = async (req, res) => {
  try {
    let query = {
      include: [{
        model: db.district,
        as: "districtData",
      }]
    }
    let data = await city.findAllRecord(query)
    res.send(data)
  } catch (e) {
    console.log({ e })
    res.status(500).json("Server side error")
  }
}
exports.adminDashboard = async (req, res) => {
  try {
    let query = {
      where: {
        user_type: 'user'
      }
    }
    let userCount = await user.recordCount(query)
    let gasStation = await carAndGas.recordCount({})
    let stationEmpCont = await stationEmp.recordCount({})
    let userRegisterRequest = await user.recordCount({where: {isApproved: false, user_type: 'user'}})
    let currentDate = new Date();
    let five = new Date(currentDate);
    five.setDate(currentDate.getDate() - 5);
    let fiveDayAgo = five.toISOString().slice(0, 10);
    let companylast5Days =  await db.sequelize.query('SELECT `company_name`, `last_login`, `l_name`,`f_name`, `contact_no`, `email` FROM `users` AS `User` WHERE ( `User`.`deletedAt` IS NULL AND( DATEDIFF(NOW(), `last_login`) > 5 AND `User`.`user_type` = "user" OR(`User`.`last_login` IS NULL AND `User`.`user_type` = "user")))', {
      model: db.user,
      mapToModel: true
    });

    let gasStationNotActive = await stationEmp.findAllUsers({
      where: {
        [Op.and]: [
         sequelize.where(sequelize.fn('datediff', sequelize.fn("NOW") , sequelize.col('last_login')), {
          [Op.gt] : 1
        }),]
      },
      include: [
        {
          model: db.gasCompany,
          as : "companyDetails"
        }
      ],
    })

    let resp = {
      car_company: userCount,
      gas_company: gasStation,
      user_registrer_request: userRegisterRequest,
      inactive_company_last_5day: companylast5Days,
      inactive_company_more_then24: gasStationNotActive,
      stationEmpCount: stationEmpCont
    }
    res.send(resp)
    
  } catch (e) {
    console.log({ e })
    res.status(500).json("Server Side Error")
  }
}

exports.addYear = async (req, res) => {
  try {
    let body = req.body
    let yearObject = await year.createRecord(body)
    res.send(yearObject)
  } catch (r) {
    console.log({ r })
    res.status(500).json("Server Side Error")

  }
}
exports.addCarType = async (req, res) => {
  try {
    let body = req.body
    let carTypeObject = await carType.createRecord(body)
    res.send(carTypeObject)
  } catch (r) {
    console.log({ r })
    res.status(500).json("Server Side Error")

  }
}

exports.addBrand = async (req, res) => {
  try {
    let body = req.body
    let brandObject = await brand.createRecord(body)
    res.send(brandObject)
  } catch (r) {
    console.log({ r })
    res.status(500).json("Server Side Error")

  }
}

exports.commonList = async (req, res) => {
  try {
    let query = {
      where: {
        isActive: true
      }
    }
    let brandArray = await brand.findAllRecord(query)
    let carTypeArray = await carType.findAllRecord(query)
    let yearArray = await year.findAllRecord(query)
    let fuelType = await FuelPrice.findAllRecord({})
    let companyList = await user.findAllUsers({where: {isActive: true, user_type: constant.USER_TYPE.user}, attributes: ['user_id', 'company_name']})
    let gasCompanyList = await carAndGas.findAllGasCompany({where: {isActive: true}, attributes: ['company_id', 'company_name']})
    let stationName = await stationEmp.findAllUsers({where: {isActive: true}, attributes: ['company_id', 'station_name', 'station_id']})
    let resp = {
      brand: brandArray,
      type: carTypeArray,
      year: yearArray,
      fuelType: fuelType,
      car_company_name: companyList,
      gas_company_name: gasCompanyList,
      gas_station_name: stationName
    }
    res.send(resp)
  } catch (r) {
    console.log({ r })
    res.status(500).json("Server Side Error")

  }
}
exports.supportList = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query = {
      where: {
        [Op.or]: {
          status: {
            [Op.like]: `%${body.search_key}%`,
          },
        },
      },
      include: [
        {
          model: db.station_emp,
          as: "station_emp_data",
          attributes: {
            exclude: ['password', 'supervisor_password']
          }
        },
      ],
      limit: body.limit,
      offset: body.offset,
      order: [["support_id", "DESC"]],
    };

    let data = await support.findAllRecord(query);
    let count = await support.recordCount({ where: {[Op.or]: {status: {[Op.like]: `%${body.search_key}%`, }, },
    }});

    if (data.length) {
      let resp = {
        data,
        count
      }
      res.send(resp)
    } else {
      res.send([])
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.supportUpdate = async (req, res) => {
  try {
    let body = req.body
    let id = req.params.id
    let query = { where: { support_id: id } }
    await support.updateRecord(body, query)
    res.send({ message: 'Record updated successfully' })
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.addPackage = async (req, res) => {
  try {
    let body = req.body;
    let data = await package.createRecord(body);
    res.send(data);
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};

exports.updatePackage = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        package_id: id,
      },
    };
    let checkingObj = await package.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await package.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};
exports.listPackage = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      limit: body.limit,
      offset: body.offset,
      order: [["package_id", "DESC"]],
    };
    let packageList = await package.findAndCount(query2);
    let count = await package.recordCount({});

    if (packageList) {
      let resp = {
        data: packageList.rows,
        count: count
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getPackage = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        package_id: id,
      },
    };
    let getData = await package.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};

exports.deletePackage = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        package_id: id,
      },
    };
    let getData = await package.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await package.deleteRecord(query);
    res.json("Record deleted successfully");
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};

exports.addDefaultFee = async (req, res) => {
  try {
    let body = req.body;
    let data = await defaultFee.createRecord(body);
    res.send(data);
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};

exports.updateDefaultFee = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let query = {
      where: {
        default_fee_id: id,
      },
    };
    let checkingObj = await defaultFee.singleRecord(query);
    if (!checkingObj) {
      res.status(400).json("Record not exists");
      return;
    }
    await defaultFee.updateRecord(body, query);
    res.send("Record updated successfully");
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};
exports.listDefaultFee = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      limit: body.limit,
      offset: body.offset,
      order: [["default_fee_id", "DESC"]],
    };
    let defaultList = await defaultFee.findAndCount(query2);
    let count = await defaultFee.recordCount({});

    if (defaultList) {
      let resp = {
        data: defaultList.rows,
        count: count
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.getDefaultFee = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        default_fee_id: id,
      },
    };
    let getData = await defaultFee.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    res.send(getData);
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};

exports.deleteDefaultFee = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {
      where: {
        default_fee_id: id,
      },
    };
    let getData = await defaultFee.singleRecord(query);
    if (!getData) {
      res.status(400).json("Record not exists");
      return;
    }
    await defaultFee.deleteRecord(query);
    res.json("Record deleted successfully");
  } catch (error) {
    console.log({ error })
    res.status(500).json("Server side error");
  }
};

exports.adminList = async (req, res) => {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = body.limit == undefined ? 10 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    let query2 = {
      where: {
        [Op.or]: {
          f_name: {
            [Op.like]: `${body.search_key}%`,
          },
          l_name: {
            [Op.like]: `${body.search_key}%`,
          },
          email: {
            [Op.like]: `${body.search_key}%`,
          }
        },
        user_type: constant.USER_TYPE.admin
      },
      limit: body.limit,
      offset: body.offset,
      order: [["user_id", "DESC"]],
    };
    let admins = await user.findAndCount(query2);
    let count = await user.recordCount({ where: { user_type: constant.USER_TYPE.admin } });

    if (admins) {
      let resp = {
        data: admins.rows,
        count: count
      };
      res.send(resp);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};
exports.adminUpdate = async (req, res) => {
  try {
    let body = req.body
    let id = req.params.id

    if(body.email) {
      delete body.email
    }
    if(body.password) {
      delete body.password
    }
    if(body.credit) {
      delete body.credit
    }
    let query = {where: {user_id: id, user_type: constant.USER_TYPE.admin}}
    let checkData = await user.singleRecord(query)
    if(!checkData) {
      res.status(400).json("Record not found")
      return
    }
    await user.updateRecord(body, query)
    query.attributes = ['contact_no', 'email', 'f_name', 'l_name']
    let object = await user.singleRecord(query)
    res.send(object)
  } catch (error) {
    console.log(error)
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.adminGet = async (req, res) => {
  try {
    let id = req.params.id
    let query = {where: {user_id: id, user_type: constant.USER_TYPE.admin}}
    let getUer = await user.singleRecord(query)    
    res.send(getUer)
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.adminDelete = async (req, res) => {
  try {
    let id = req.params.id
    let query = {where: {user_id: id, user_type: constant.USER_TYPE.admin}}
    let checkAdmin = await user.singleRecord(query)
    if(!checkAdmin) {
      res.status(400).json("Record not found")
      return
    }
    await user.deleteUser(query)    
    res.send('Record upadated')
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.adminDetails = async (req, res) => {
  try {
    let id = req.params.id
    let query = {where: {user_id: id, user_type: constant.USER_TYPE.admin}}
    let adminData =  await user.singleRecord(query)    
    res.send(adminData)
  } catch (error) {
    res.status(500).json(`Errro  ${error}`);
  }
};

exports.transferBalance = async(req, res)=> {
  try {
    let body = req.body
    let dFee = await defaultFee.findAllRecord({isActive: true})
    dFee = JSON.parse(JSON.stringify(dFee))
    let userD = await user.singleRecord({where: {user_id: body.user_id}})
    userD = JSON.parse(JSON.stringify(userD))
    if(userD.commission === null || userD.commission === 'null' || userD.commission === '0.00' || userD.commission === 0.00) {
      getCarCount = await car.countRecord({where: {user_id: body.user_id, isActive: true}})
      if(!getCarCount) {
        res.status(400).json({message: 'please add one car atleast'})
        return
      }
      userD.commission = await getCommission(getCarCount)
    }
    body.fees = parseFloat(body.amount) * (userD.commission ? userD.commission : 15 ) / 100
    body.commision = parseFloat(body.amount) * (userD.commission) / 100
    body.vat = parseFloat(body.amount) * (dFee[0].vat ? dFee[0].vat : 15) / 100
    body.transfer_amount = body.amount
      
    let allCharge = parseFloat(body.commision) + parseFloat(body.vat)
    console.log(allCharge)
    let chargesAmount = body.amount - allCharge
    body.actual_amount = chargesAmount
    console.log(body)
    
    if(userD.credit_wit_charges === '0.00' || userD.credit_wit_charges === null) {
      userD.credit_wit_charges = 0
    }
    if(userD.credit === '0.00' || userD.credit === null) {
      userD.credit = 0
    }
    let updateChargesAmount =  parseFloat(chargesAmount) + parseFloat(userD.credit_wit_charges)
    let userCredit = parseFloat(body.amount) + parseFloat(userD.credit)    
    let adminTrans = await adminAmountTransfer.createRecord(body)
    if(adminTrans) {
      let up = await user.updateRecord({credit_wit_charges: updateChargesAmount, credit: userCredit}, {where: {user_id: body.user_id}})
      if(up[0] === 1 || up[0] === '1') {
        await mail.creditTransferByAdmin(body, userD)
      }

      res.send("transaction done")
    } else {
      res.status(400).json({message : 'some thing went wrong'})
    }   

  } catch (e) {
    console.log({e})
    res.status(500).json(`Server Side Error ${e}`)
  }
}

exports.billForcredit = async (req, res)=> {
  try {
    let body = req.query
    body.limit = body.limit == undefined ? 12 : parseInt(body.limit);
    body.offset = body.offset == undefined ? 0 : parseInt(body.offset);
    if(!body.search_key) {
      body.search_key = ''
    }
    let query = {
      where: {
        // [Op.or]: {
        //   car_plate: {
        //     [Op.like]: `%${body.search_key}%`,
        //   }
        // },
      },
      limit: body.limit,
      offset: body.offset,
      order: [["transaction_id", "DESC"]],

    }
    let trans = await adminTransaction.findAllRecords(query)
    let count = await adminTransaction.recordCount()
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
    res.status(500).json(`Server Side error ${e}`)
  }
}

exports.userDelete = async (req, res)=> {
  try {
    let id  = req.params.id
    let query = {
      where: {
        user_id: id
      }
    }
    let queryForSum = {
      attributes: [
        [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
    ],
      where : {
        user_id: id
      }
    }
    let userD = await user.singleRecord(query)
    if(parseFloat(userD.credit) > 0) {
      res.send("user wallet not empty")
      return
    }
    
    let getAllBranch = await branch.findAllBranches(queryForSum)
    if(getAllBranch.length) {
      // for (let i = 0; i < getAllBranch.length; i++) {
        if(getAllBranch.length && parseFloat(getAllBranch[0].credit) > 0) {
          res.send("branch wallet not empty")
          return
        }        
      // }
    }
    let getAllCar = await car.findAllcars(queryForSum)
    // for (let i = 0; i < getAllCar.length; i++) {
      if(getAllCar.length && parseFloat(getAllCar[0].credit) > 0) {
        res.send("car wallet not empty")
        return
      }        
    // }
    await user.deleteUser(query)    
    await branch.removeRecord(query)
    await car.removeRecord(query)
    await transaction.removeRecord(query)
    await adminAmountTransfer.deleteRecord(query)
    res.send("record deleted successfully")
  } catch (e) {
    console.log({e})
    res.status(500).json(`Server Side error ${e}`)
  }
}

exports.resetAccount = async (req, res)=> {
  try {
    let id = req.params.id
    let bodyUpdate = {
      credit : 0
    }
    let query = {where: {user_id: id}}
    let userD = await user.singleRecord(query)
    if(!userD) {
      res.send('User does not exists')
      return
    }
    await user.updateRecord({credit: 0, credit_wit_charges: 0}, query)
    await car.updateRecord(bodyUpdate, query)
    await branch.updateRecord(bodyUpdate, query)
    res.send("Amount reset successfully")

  } catch (e) {
    res.status(500).json(`Server Side error ${e}`)
  }
}



exports.saveCarWithCsv = async(req, res)=> {
  try {
    let time = new Date().getTime() / 1000;
    if (req.files && req.files.file){
      let data =  await csvUpload(req.files.file, time)
      let array = []
      let path = `./public/images/${time}.csv`
      if(data) {
        if(path) {
          const jsonArray = await csv().fromFile(`./public/images/${time}.csv`);
          if(jsonArray.length) {
            jsonArray.forEach(element => {
            let key = Object.keys(element) 
            if(key.length >= 3) {              
              array.push(element)
            }
          });
          let isAllRight = false
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
          let isUserId = false
          let userData = false
          let catPlateValid = false
          for (let i = 0; i < array.length; i++) {
            if(!array[i].hasOwnProperty('vehicle_company_id')) {
              isUserId = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            array[i].user_id = array[i].vehicle_company_id
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
            let userDe = await user.singleRecord({where: {user_id: array[i].user_id}})
            if(!userDe) {
              userData = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }

            if(!yearData) {
              isYearData = true
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              break;
            }
            let branchData = await branch.singleRecord({where: {branch_id: array[i].branch_id, user_id: array[i].user_id}})
            if(!branchData) {
              isBranchExists = true
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
            let fuelType = await FuelPrice.singleRecord({where: {fuel_type: array[i].fuel_type}})
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
            res.status(400).json({message: 'Car plat is required'})
            return;
          }
          if(isUserId) {
            res.status(400).json({message: 'Vehicle company_id required'})
            return;
          }
          if(userData) {
            res.status(400).json({message: 'User not found'})
            return;
          }
          
          if(isBranchId) {
            res.status(400).json({message: 'Branch id is required'})
            return;
          }
          if(isYear) {
            res.status(400).json({message: 'Year is required'})
            return;
          }
          if(isType) {
            res.status(400).json({message: 'Type is required'})
            return;
          }
          if(isBrand) {
            res.status(400).json({message: 'Brand is required'})
            return;
          }
          if(isFuelType) {
            res.status(400).json({message: 'fuel type is required'})
            return;
          }
          if(isFuelTypeData) {
            res.status(400).json({message: 'fuel type not found'})
            return;
          }
          if(isBranchExists) {
            res.status(400).json({message: 'Branch not exists'})
            return; 
          }
          if(isCarAlreadyExist) {
            res.status(400).json({message: 'car plate already exists'})
            return;
          }
          if(isYear) {
            res.status(400).json({message: 'Year is required'})
            return;
          }
          if(isYearData) {
            res.status(400).json({message: 'Year not valid'})
            return;
          }
          
          if(isCarTypeData){
            res.status(400).json({message: 'car type not exists'})
            return;
          }
          if(isFuelType) {
            res.status(400).json({message: 'car fuel type exists'})
            return;
          }
          if(isBrandData) {
            res.status(400).json({message: 'Brand not found'})
            return;
          }
          if(catPlateValid) {
            res.status(400).json({message: 'Vehicle plate not vaid'})
            return;
          }
          
          await car.bulCreateRecord(array)        
          if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
          res.send({message: 'Car uploaded successfully'})
        }
      } else {
        if (fs.existsSync(path)) fs.unlinkSync(path);
        res.send({message: {en: 'csv not converted plase try again', ar: 'لم يتم تحويل csv يرجى المحاولة مرة أخرى'}})
        return
      }
    }
    }
 
  } catch (e) {
    console.log({e})
    res.status(500).json('Server Side error')
  }
}

exports.saveStationWithCsv = async (req, res)=> {
  try {
    var time = new Date().getTime() / 1000;
    if (req.files && req.files.file){
      let data =  await csvUpload(req.files.file, time)
      let array = []
      let path = `./public/images/${time}.csv`
      if(data) {
        if(path) {
           const jsonArray = await csv().fromFile(`./public/images/${time}.csv`)
           if(jsonArray.length){
             jsonArray.forEach(element => {
               let key = Object.keys(element) 
               if(key.length >= 3) {
                 array.push(element)
                }
              });
              let isMail = false
              let isFuelType = false
              let isCompanyExists = false
              let isCompany_id = false
              let superVisorName = false
              let isMobile = false
              let isLat = false
              let isLong = false
              let latRange = false
              let longRange = false
              let isFuelTypeR = false
              let mobileNo = false
              for (let i = 0; i < array.length; i++) {
                console.log(array[i])
                if(!array[i].hasOwnProperty('company_id')) {
                  isCompany_id = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
                if(!array[i].hasOwnProperty('supervisor_name')) {
                  superVisorName = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
                if(!array[i].hasOwnProperty('mobile_no')) {
                  isMobile = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
                if(!array[i].hasOwnProperty('email')) {
                  isMail = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
                if(!array[i].hasOwnProperty('lat')) {
                  isLat = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
                if(!array[i].hasOwnProperty('long')) {
                  isLong = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break         
                }
                if(!array[i].hasOwnProperty('fuel_type')) {
                  isFuelTypeR = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break         
                }
                array[i].fuel_type = array[i].fuel_type.split(',')
                for (let j = 0; j < array[i].fuel_type.length; j++) {
                  let fData = await FuelPrice.singleRecord({where: {fuel_price_id: array[i].fuel_type[j]}})
                  if(!fData) {
                    isFuelType = true
                    if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                    break;
                  }
                }

                let cId = await carAndGas.singleRecord({where: {company_id: array[i].company_id}})
                if(!cId) {
                  isCompanyExists = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break;
                }
                let password = generator.generate({
                  length: 10,
                  numbers: true
                });
                array[i].plain_password = password
                array[i].password = await helper.createPassword(array[i].plain_password)
                if(array[i].fuel_type.length) {
                  array[i].fuel_type_id = array[i].fuel_type.toString()
                }
                array[i].lat = parseFloat(array[i].lat)
                array[i].long = parseFloat(array[i].long)
                if(array[i].lat > (-90) &&  array[i].lat < 90) {

                } else {
                  latRange = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
                if(array[i].long > (-180) &&  array[i].long < 180) {
                  
                } else {
                  longRange = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);180
                  break
                }
                let mobileRegex = /^(?=.{10,15})\d{10,15}$/gm
                let checking = mobileRegex.test(array[i].mobile_no)
                if(checking === false) {
                  mobileNo = true
                  if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
                  break
                }
              }
              
              if(isFuelTypeR) {
                res.send('fuel type is required')
                return;
              }
              if(mobileNo) {
                res.send('Please enter valid mobile number')
                return;
              }
              if(longRange) {
                res.send('Longtitude range between -180 to 180 please enter valid range')
                return;
              }
              if(isCompany_id) {
                res.send('Company id required')
                return;
              }
              if(isLong) {
                res.send('longtitude is required')
                return;
              }
              if(isLat) {
                res.send('Latitude is required')
                return;
              }
              if(isMobile) {
                res.send('Mobile number is required')
                return;
              }
              if(latRange) {
                res.send('Latitude range between -90 to 90 please enter valid range')
                return;
              }
              if(superVisorName) {
                res.send('Supervisor name required')
                return;
              }
              if(isMail) {
                res.send('Email id required')
                return;
              }
              if(isFuelType) {
                res.send('Fuel type not exists')
                return;
              }
              if(isCompanyExists) {
                res.send('Company id is wrong')
                return;
              }   
              let networkArray = []
              for (let k = 0; k < array.length; k++) {
                let emailChecking = await stationEmp.findAllUsers({where: {email: array[k].email}});
                if (emailChecking.length) {
                } else {
                  let password = generator.generate({
                    length: 10,
                    numbers: true
                  });
                  // array[k].supervisor_password_plain = password 
                // array[k].supervisor_password = await helper.createPassword(array[k].supervisor_password_plain);
                  let lastFourDigits = array[k].mobile_no.substr(-4);
                  array[k].supervisor_password_plain = lastFourDigits
                  array[k].supervisor_password = await helper.createPassword(array[k].supervisor_password_plain);
                }
                let station = await stationEmp.createRecord(array[k]);
                let bodyDataForNetwork = {
                  company_id: parseInt(station.company_id),
                  station_id: parseInt(station.station_id)         
                }
                networkArray.push(bodyDataForNetwork)
                if(station.supervisor_password_plain && station.supervisor_password) {
                  await mail.newGasStation(array[k], station, array[k].plain_password, array[k].supervisor_password_plain)
                } else {
                  await mail.newGasStation(array[k], station, array[k].plain_password, emailChecking[0].supervisor_password_plain)
                }
              }
              data = JSON.parse(JSON.stringify(data)) 
              // console.log(`data)
              if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
              console.log('network12')
              networkArray = JSON.parse(JSON.stringify(networkArray)) 
              await db.network.bulkCreate(networkArray)
              res.send('Mass uploaded done')
            } else {
              res.status(400).json({message: "Csv file not convert in to json format"})
            }
        } else {
          if (fs.existsSync(path)) fs.unlinkSync(path);
          res.send({message: {en: 'csv not converted plase try again', ar: 'لم يتم تحويل csv يرجى المحاولة مرة أخرى'}})
          return
        }
      } else {
        res.status(400).json({message: "Csv file not uploaded"})
      }
    } else {
      res.status(400).json({message: "Csv file required"})
    }
  } catch (e) {
    console.log({e})
    if (fs.existsSync(`./public/images/${time}.csv`)) fs.unlinkSync(`./public/images/${time}.csv`);
    res.status(500).json('Server Side error')
  }
}


exports.companyName = async(req, res) => {
  try {
    let company = await user.findAllUsers({where: {user_id: req.params.id, isActive: true}, attributes: ['user_id', 'company_name']})
    let branchName = await branch.findAllBranches({where: {user_id: req.params.id, isActive: true}, attributes: ['user_id', 'branch_name']}) 
    res.send({
      company_name: company,
      branch_name: branchName 
    })

  } catch (e) {
    console.log({e})
    res.status(500).json(`Server side error ${e}`)
  }
}



exports.paymentProcessList = async (req, res)=> {
  try {
    let body = req.query;
    if (!body.search_key) {
      body.search_key = "";
    }
    body.limit = (body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = (body.offset) == undefined ? 0 : parseInt(body.offset);
    let query = {
      where: {
        [Op.or]: {
          company_name: {
            [Op.like]: `%${body.search_key}%`,
          }
        },
        status: 'open',
        
      },
      attributes: ['company_id', 'company_name','status'],
        include : [{
          model: db.station_emp,
          as: "stationDetail",
          where: {
            credit : {
              [Op.gt]: 0,
            }
          }
        }],
      limit: body.limit,
      offset: body.offset,
      order: [["company_id", "ASC"]],
    };
    let data = await carAndGas.findAllGasCompany(query)
    data = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < data.length; i++) {
      if(data[i].stationDetail.length) {
        let a = data[i].stationDetail.reduce(function(sum, current) {
          return sum + parseFloat(current.credit);
        }, 0);
        data[i].total = a
        delete data[i].stationDetail        
      }      
    }
    res.send(data)


  } catch (e) {
    console.log({e})
    res.status(500).json(`Server side error ${e}`)
  }
}

exports.paymentProceed = async (req, res)=> {
  try {
    let id = req.params.id
    let body = req.body
    let getPay = await payment.singleRecord({where: {payment_id: id}})
    let companyDetails  = await carAndGas.singleRecord({where: {company_id: getPay.company_id}})

    if(!getPay) {
      res.status(400).json("payment id not found")
      return
    }
    if (req.files && (req.files.file)) {
      let image = req.files.file
      let imageName = new Date().getTime() / 1000;
      await fileUploadPdf(image, `${imageName}`);
      body.receipt = `./pdf/${imageName}.pdf`
    }
    let up = await payment.updateRecord(body, {where: {payment_id: id}})
    if(up[0] === 1 || up[0] === '1') {
      let getPath = await payment.singleRecord({where: {payment_id: id}})
      if(getPath && getPath.receipt) {
        await mail.paymentByAdmin(getPath, companyDetails)
      }
    }
    res.send("Payment successfully done")
  } catch (e) {
    console.log({e})
    res.status(500).json(`Server side error ${e}`)
  }
}

exports.paymentList = async (req, res)=> {
  try {
    let body = req.query;
    let where
    if(body.due_date) {
      where = {
        [Op.or]: {
          due_date: body.due_date
        },
        status: body.status
      }
    } else if(body.transaction_date && body.due_date) {
      where = {
        [Op.or]: {
          updatedAt: {
            [Op.gt]: body.transaction_date + ' 00:00:00',
            [Op.lt]: body.transaction_date + ' 23:59:59'
          },
          due_date: body.due_date
        },
        status: body.status
      }
    } else if(body.transaction_date) {
      where = {
        [Op.or]: {
          updatedAt: {
            [Op.gt]: body.transaction_date + ' 00:00:00',
            [Op.lt]: body.transaction_date + ' 23:59:59'
          },
        },
        status: body.status
      }
    } else {
      where = {status: body.status}
    } 
    body.limit = (body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = (body.offset) == undefined ? 0 : parseInt(body.offset);
    let query = {
      where,
      limit: body.limit,
      offset: body.offset,
      order: [["payment_id", "DESC"]],
    };
    let data = await payment.findAllpayments(query)
    let count = await payment.countRecord(query)
    resp = {
      data,
      count
    }
    res.send(resp)

  } catch (e) {
    console.log({e})
    res.status(500).json(`Server side error ${e}`)
  }
}

exports.CompaniesSummary = async(req, res)=> {
  try {
    let body = req.query;
    body.limit = parseInt(body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = parseInt(body.offset) == undefined ? 0 : parseInt(body.offset);
    let query = {
      where: {
        user_type: 'user',
        isActive: true
      },
      include: [
        {
          model: db.car,
          as: "carDetails",
          
        },
        {
          model: db.branch,
          as: "branchDetails",
        },
        {
          model: db.transaction,
          as: "transactionDetails",
        },  
      ],
      attributes: ['user_id', 'commission','company_name', 'isActive', 'createdAt'],
      limit: body.limit,
      offset: body.offset,
      order: [["user_id", "DESC"]],
    }
    let users = await user.findAllUsers(query)
    let count = await user.recordCount({where: {
      user_type: 'user',
      isActive: true
    }})
    users = JSON.parse(JSON.stringify(users))
    // res.send({users, count: users.length})
    // return
    for (let i = 0; i < users.length; i++) {
      if(users[i].carDetails && users[i].carDetails.length) {
        users[i].car_count = users[i].carDetails.length
      } else {
        users[i].car_count = 0
      }

      if(users[i].branchDetails && users[i].branchDetails.length) {
        users[i].branch_count = users[i].branchDetails.length
      } else {
        users[i].branch_count = 0
      }
      if(users[i].transactionDetails && users[i].transactionDetails.length) {
        let total =  users[i].transactionDetails.reduce(function(sum, current) { 
          return sum + parseInt(current.fuel_amount);
        }, 0);
        users[i].spend_money = total
      } else {
        users[i].spend_money = 0
      }
      
      if(users[i].commission === null || users[i].commission === 'null'||  users[i].commission === '0.00' || users[i].commission === 0.00) {
        users[i].commission = await getCommission(users[i].car_count)
      }
      delete users[i].transactionDetails
      delete users[i].carDetails
      delete users[i].branchDetails
    }
    let resp = {
      data: users,
      count
    }

    res.send(resp)
  } catch (e) {
    res.status(500).json('server side error'+ e)
  }
}

exports.gasStationSummary = async(req, res)=> {
  try {
    let body = req.query;
    body.limit = (body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = (body.offset) == undefined ? 0 : parseInt(body.offset);
    let query = {
      include: [
        {
          model: db.station_emp,
          as: 'stationDetail'
        }
      ],
      attributes: ['company_id','company_name', 'isActive', 'createdAt',],
      limit: body.limit,
      offset: body.offset,
      order: [["company_id", "DESC"]],
    }
    let users = await carAndGas.findAllGasCompany(query)
    let count = await carAndGas.recordCount({})

    users = JSON.parse(JSON.stringify(users))
    for (let i = 0; i < users.length; i++) {
      if(users[i].stationDetail.length) {
        users[i].station_count = users[i].stationDetail.length
      } else {
        users[i].station_count = 0
      }
      let to = 0
      for (let j = 0; j < users[i].stationDetail.length; j++) {
        console.log()
       let details  = await transaction.findAlltransactions({where: {station_user_id: users[i].stationDetail[j].station_id},
        attributes: [
          [sequelize.fn('sum', sequelize.col('fuel_amount')), 'sum'] ]})
          console.log('sum', details[0])
          details = JSON.parse(JSON.stringify(details))
          if(details[0]) {
            to = to + details[0].sum
          }
      }
      users[i].total_sell = to
      // let count  = await transaction.findAlltransactions({where: {station_id: }})
      // if(users[i].stationDetail.length) {
      //   let total =  users[i].stationDetail.reduce(function(sum, current) { 
      //     return sum + parseFloat(current.credit);
      //   }, 0);
      //   users[i].total_sell = total

      // } else {
      //   users[i].total_sell = 0
      // }
      delete users[i].stationDetail     
    }
    let resp = {
      data: users,
      count
    }
    res.send(resp)
  } catch (e) {
    console.log(e)
    res.status(500).json('server side error'+ e)
  }
}

exports.gasStationSails = async(req, res)=> {
  try {
    let body = req.query;
    body.limit = (body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = (body.offset) == undefined ? 0 : parseInt(body.offset);
    let where = {}
    if(body.start_date && body.end_date) {
      where.createdAt = {
        [Op.gt]: body.start_date + ' 00:00:00',
        [Op.lt]: body.end_date + ' 23:59:59'
      }
    }
    let query = {
      where,
      include: [
        {
          model: db.station_emp,
          as: 'stationDetails',
          attributes: ['station_id', 'company_id', 'station_name'],
          include: [
            {
              model: db.gasCompany,
              as: 'companyDetails',
              attributes: ['company_name', 'f_name', 'l_name'],
            }         
          ]
        },
        {
          model: db.branch,
          as: 'branchDetails',
          attributes: ['branch_id', 'city_id', 'district_id', 'branch_name'],
          include: [
            {
              model: db.city,
              as: "cityData",
              attributes: ['city_id', 'name']
            },
            {
              model: db.district,
              as: "districtData",
              attributes: ['district_id', 'name']

            },
          ]
        }, 
        {
          model: db.car,
          as: 'carDetail',
          attributes: ['car_id','car_plate', 'fuel_type_id'],

          include: [
            {
              model: db.fuelPrice,
              as: 'fuelTypeDetails',
              attributes: ['fuel_price_id','fuel_type'],
            },   

          ]
        }
      ],
      // attributes: ['company_id','company_name', 'isActive', 'createdAt'],
      limit: body.limit,
      offset: body.offset,
      order: [["transaction_id", "DESC"]],
    }
    let trans = await transaction.findAlltransactions(query)
    let count = await transaction.countRecord({where: where})

    trans = JSON.parse(JSON.stringify(trans))
    let array = []
    for (let i = 0; i < trans.length; i++) {
      let obj = {}
      obj.transaction_id = trans[i].transaction_id

      obj.prifix_id = trans[i].prifix_id
      if(trans[i] && trans[i].stationDetails && trans[i].stationDetails.companyDetails && trans[i].stationDetails.companyDetails.company_name) {
        obj.company_name = trans[i].stationDetails.companyDetails.company_name

      }
      if(trans[i] && trans[i].stationDetails && trans[i].stationDetails.station_name) {
        obj.station_name = trans[i].stationDetails.station_name

      }
      if(trans[i] && trans[i].branchDetails && trans[i].branchDetails.cityData) {
        obj.city = trans[i].branchDetails.cityData.name

      }
      if(trans[i] && trans[i].branchDetails && trans[i].branchDetails.districtData) {
        obj.district = trans[i].branchDetails.districtData.name
      }
      if(trans[i] && trans[i].carDetail && trans[i].carDetail.fuelTypeDetails) {
        obj.fuel_type = trans[i].carDetail.fuelTypeDetails.fuel_type
      }
      obj.amount = trans[i].fuel_amount
      obj.createdAt = trans[i].createdAt 
      array.push(obj)
      delete trans[i].carDetail
      delete trans[i].branchDetails
      delete trans[i].stationDetails           
    }
    let resp = {
      data: array,
      count
    }
    res.send(resp)
  } catch (e) {
    console.log(e)
    res.status(500).json('server side error'+ e)
  }
}

exports.companySales  = async(req, res) => {
  try {
    let body = req.query;
    body.limit = (body.limit) == undefined ? 10 : parseInt(body.limit);
    body.offset = (body.offset) == undefined ? 0 : parseInt(body.offset);
    let where = {}
    if(body.start_date && body.end_date) {
      where.createdAt = {
        [Op.gt]: body.start_date + ' 00:00:00',
        [Op.lt]: body.end_date + ' 23:59:59'
      }
    }
    let query = {
      where,
      include: [
        {
          model: db.user,
          as: 'userDetails',
          attributes: ['user_id', 'company_name'],
        },
        {
          model: db.branch,
          as: 'branchDetails',
          attributes: ['branch_id', 'city_id', 'district_id', 'branch_name'],
          include: [
            {
              model: db.city,
              as: "cityData",
              attributes: ['city_id', 'name']
            },
            {
              model: db.district,
              as: "districtData",
              attributes: ['district_id', 'name']

            },
          ]
        },
      ],
      limit: body.limit,
      offset: body.offset,
      order: [["transaction_id", "DESC"]],
    }
    let trans = await transaction.findAlltransactions(query)
    let count = await transaction.countRecord({where: where})

    trans = JSON.parse(JSON.stringify(trans))
    let array = []
    // for (let i = 0; i < trans.length; i++) {
    //   let obj = {}
    //   obj.transaction_id = trans[i].transaction_id
    //   if(trans[i].stationDetails.companyDetails) {
    //     obj.company_name = trans[i].stationDetails.companyDetails.company_name

    //   }
    //   if(trans[i].branchDetails.cityData) {
    //     obj.city = trans[i].branchDetails.cityData.name

    //   }
    //   if(trans[i].branchDetails.districtData) {
    //     obj.district = trans[i].branchDetails.districtData.name
    //   }
    //   if(trans[i].carDetail.fuelTypeDetails) {
    //     obj.fuel_type = trans[i].carDetail.fuelTypeDetails.fuel_type
    //   }
    //   obj.amount = trans[i].fuel_amount
    //   obj.createdAt = trans[i].createdAt 
    //   array.push(obj)
    //   delete trans[i].carDetail
    //   delete trans[i].branchDetails
    //   delete trans[i].stationDetails           
    // }
    let resp = {
      data: trans,
      count
    }
    res.send(resp)
  } catch (e) {
    console.log(e)
    res.status(500).json('server side error'+ e)
  }
}


exports.invoiceCall = async(req, res)=>{
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
      defaultFeeData[0].commission = defaultFeeData[0].commission = await helper.getCommission(getCarCount)
    } else {
      defaultFeeData[0].commission = userD.commission
    }
    data[i].credit_consumed =  parseFloat(data[i].amount) - parseFloat(userD.credit)

    data[i].vat_percentage = defaultFeeData[0].vat
    data[i].commission_percent = defaultFeeData[0].commission
    data[i].commission_amount = (parseFloat(data[i].credit_consumed) * parseFloat( defaultFeeData[0].commission))/100
    data[i].vat = (parseFloat(data[i].credit_consumed) * parseFloat(defaultFeeData[0].vat))/100
    data[i].total = parseFloat(data[i].amount ) + parseFloat(data[i].vat)
    data[i].start_date = start + ' 00:00:00'
    data[i].end_date = end + ' 23:59:59'   
    let obj = await invoice.createRecord(data[i])
    if(obj){
      await mail.monthlyInvoice(userD, data[i].month, obj)
     }
  }
  res.send({message: 'send'})
  console.log(`${data} successfully run the job`)
  } catch (e) {
    console.log({e})
    res.status(500).json({message : `Server Side Error ${e}`})
  }
}

exports.adminDashboardSale = async (req, res) => {
  try {
    // query
    let body = req.query
    let inputeDate = new Date(body.date);
    const startOfMonth =  moment(inputeDate).startOf('month').format('YYYY-MM-DD hh:mm:ss');
    const endOfMonth   = moment(inputeDate).endOf('month').format('YYYY-MM-DD hh:mm:ss');
    let firstDay = moment(startOfMonth).startOf("day").format('YYYY-MM-DD')
    let lastDay = moment(endOfMonth).endOf("day").format('YYYY-MM-DD')
    // let firstDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth(), 1);
    // let lastDay = new Date(inputeDate.getFullYear(), inputeDate.getMonth() + 1, 0);
    let monthly = {
      attributes: [
        [sequelize.fn('sum', sequelize.col('commission')), 'sum'],
        [sequelize.fn('count', sequelize.col('transaction_id')), 'count'],

      ],
      where: {
        createdAt : {
          [Op.gt]: firstDay + ' 00:00:00',
          [Op.lt]: lastDay + ' 23:59:59'
        },
      },
    }
    const startOfYear =  moment(body.date).startOf('year').format('YYYY-MM-DD hh:mm:ss');
    const endOfYear   = moment(body.date).endOf('year').format('YYYY-MM-DD hh:mm:ss');
    let start = moment(startOfYear).startOf("day").format('YYYY-MM-DD')
    let end = moment(endOfYear).endOf("day").format('YYYY-MM-DD')

    let yearly = {
      where: {
        createdAt : {
          [Op.gt]: start + ' 00:00:00',
          [Op.lt]: end + ' 23:59:59'
        },
      },
      attributes: [
          [sequelize.fn('sum', sequelize.col('commission')), 'commission'],
          [sequelize.fn('count', sequelize.col('transaction_id')), 'count'],
          [sequelize.fn("concat", sequelize.literal(`MONTHNAME(createdAt)`)), 'month'],
          [sequelize.literal(`MONTH(createdAt)`), "month_number"],
      ],
      group: ['month'],
    }
    // monthly
    let dt = new Date(body.date);
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();
    let daysInMonth = new Date(year, month, 0).getDate();
    // console.log({firstDay: firstDay})
    // process.exit()
    
    let traverse = firstDay 
    let array = []
    let monthData
    let weeklyData
    // monthly data 
    let weekQuery

    for (let i = 0; i < daysInMonth; i++) {
      console.log('traverse ==> ',traverse)
     let  monthly = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('commission')), 'sum'],
          [sequelize.fn('count', sequelize.col('transaction_id')), 'count'],
        ],
        where: {
          createdAt : {
            [Op.gt]: traverse + ' 00:00:00',
            [Op.lt]: traverse + ' 23:59:59'
          },
        }
      }
      monthData = await transaction.findAlltransactions(monthly);
      monthData = JSON.parse(JSON.stringify(monthData))
      array.push({
        amount: monthData[0].sum ? monthData[0].sum : 0,
        date: traverse,
        count: monthData[0].count ? monthData[0].count : 0
      })
      traverse = new Date(traverse);
      traverse = new Date(traverse.setDate(traverse.getDate() + 1 )).toISOString().slice(0, 10);
    }
    // weekly

    let first = dt.getDate() - dt.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstdayWeek = new Date(dt.setDate(first)).toISOString().slice(0, 10);
    let traverse2 = firstdayWeek
    let array2 = []
    for (let i = 0; i < 7; i++) {
      console.log('traverse ==> ',traverse2)
      weekQuery = {
        attributes: [
          [sequelize.fn('sum', sequelize.col('commission')), 'sum'],
          [sequelize.fn('count', sequelize.col('transaction_id')), 'count'],
        ],
        where: {
          createdAt : {
            [Op.gt]: traverse2 + ' 00:00:00',
            [Op.lt]: traverse2 + ' 23:59:59'
          },
        }
      }
      weeklyData = await transaction.findAlltransactions(weekQuery);
      weeklyData = JSON.parse(JSON.stringify(weeklyData))
      array2.push({
        amount: weeklyData[0].sum ? weeklyData[0].sum : 0,
        date: traverse2,
        count: weeklyData[0].count ? weeklyData[0].count : 0
      })
      traverse2 = new Date(traverse2);
      traverse2 = new Date(traverse2.setDate(traverse2.getDate() + 1 )).toISOString().slice(0, 10);
      console.log('traverse===>',traverse2)
    }
    let data = await transaction.findAlltransactions(yearly)
    delete yearly.attributes
    delete monthly.attributes
    delete weekQuery.attributes

    


    data = JSON.parse(JSON.stringify(data))
    array = JSON.parse(JSON.stringify(array))
    array2 = JSON.parse(JSON.stringify(array2))


    let yearSumCommision = data.reduce(function(value, current) {
      return value + parseFloat(current.commission);
    }, 0);
    let monthlySumCommision = array.reduce(function(value, current) {
      return value + parseFloat(current.amount);
    }, 0);
    let weeklySumCommision = array2.reduce(function(value, current) {
      return value + parseFloat(current.amount);
    }, 0);
    let yearSumCount = data.reduce(function(value, current) {
      return value + parseFloat(current.count);
    }, 0);
    let monthlySumCount = array.reduce(function(value, current) {
      return value + parseFloat(current.count);
    }, 0);
    let weeklySumCount = array2.reduce(function(value, current) {
      return value + parseFloat(current.count);
    }, 0);

    res.send({
      yearly: await helper.properGraphForAdmin(data),
      monthly: array, 
      weekly: array2, 
      total: [{
        yearSum: {
          commission: yearSumCommision,
          count: yearSumCount
        }, 
        monthlySum: {
          commission: monthlySumCommision,
          count: monthlySumCount
        }, 
        weeklySum: {
          commission: weeklySumCommision,
          count: weeklySumCount
        }
      }
    ]})
    // res.send(data)
  } catch (e) {
    console.log({ e })
    res.status(500).json("Server Side Error")
  }
}

exports.listofTrans = async (req, res) => {
  try {
    let query = {
      include: [
        {
          model: db.station_emp,
          as: 'stationDetails',
          attributes: ['station_id', 'company_id', 'station_name'],
          include: [
            {
              model: db.gasCompany,
              as: 'companyDetails',
              attributes: ['company_name', 'f_name', 'l_name'],
            }         
          ]
        },
        {
          model: db.branch,
          as: 'branchDetails',
          attributes: ['branch_id', 'city_id', 'district_id', 'branch_name'],
          include: [
            {
              model: db.city,
              as: "cityData",
              attributes: ['city_id', 'name']
            },
            {
              model: db.district,
              as: "districtData",
              attributes: ['district_id', 'name']

            },
          ]
        }, 
        {
          model: db.car,
          as: 'carDetail',
          attributes: ['car_id','car_plate', 'fuel_type_id'],

          include: [
            {
              model: db.fuelPrice,
              as: 'fuelTypeDetails',
              attributes: ['fuel_price_id','fuel_type'],
            },   

          ]
        }
      ],
      // attributes: ['company_id','company_name', 'isActive', 'createdAt'],
      // limit: body.limit,
      // offset: body.offset,
      order: [["transaction_id", "DESC"]],
    }
    let trans = await transaction.findAlltransactions(query)
    // let count = await transaction.countRecord({where: where})

    trans = JSON.parse(JSON.stringify(trans))

    let array = []
    for (let i = 0; i < trans.length; i++) {
      let obj = {}
      obj.transaction_id = trans[i].transaction_id

      obj.prifix_id = trans[i].prifix_id ? trans[i].prifix_id : ''
      if(trans[i] && trans[i].stationDetails && trans[i].stationDetails.companyDetails && trans[i].stationDetails.companyDetails.company_name) {
        obj.company_name = trans[i].stationDetails.companyDetails.company_name  
      }
      if(trans[i] && trans[i].stationDetails && trans[i].stationDetails.station_name) {
        obj.station_name = trans[i].stationDetails.station_name

      }
      if(trans[i] && trans[i].branchDetails && trans[i].branchDetails.cityData) {
        obj.city = trans[i].branchDetails.cityData.name

      }
      if(trans[i] && trans[i].branchDetails && trans[i].branchDetails.districtData) {
        obj.district = trans[i].branchDetails.districtData.name
      }
      if(trans[i] && trans[i].carDetail && trans[i].carDetail.fuelTypeDetails) {
        obj.fuel_type = trans[i].carDetail.fuelTypeDetails.fuel_type
      }
      obj.amount = trans[i].fuel_amount
      obj.created_at = trans[i].createdAt 
      array.push(obj)
                
    }
    res.send(JSON.stringify(array))
    return

    console.log(JSON.stringify(array))
    for (let i = 0; i < array.length; i++) {
      let d = await gasStationSale.singleRecord({where: {transaction_id:array[i].transaction_id}})
      console.log('Data', d)
      if(d) {
        
      } else {
        await gasStationSale.createRecord(array[i])
      }
    }
    //  console.log(array.length);
    //  await gasStationSale.bulCreateRecord(array)
     process.exit()
    // let resp = {
    //   data: array,
    //   count
    // }
    // res.send(resp)
  }  catch (e) {
    console.log({e})
    res.status(500).json({message : `Server Side Error ${e}`})
  }
}

exports.invoiceCallData = async(req, res)=>{
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
  res.send("'Done")
  return
  let defaultFeeData = await defaultFee.findAllRecord()
  defaultFeeData = JSON.parse(JSON.stringify(defaultFeeData))

  for (let i = 0; i < data.length; i++) {

    let getCarCount = await car.countRecord({where: {user_id: data[i].user_id}})
    getCarCount = JSON.parse(JSON.stringify(getCarCount))
    let userD = await user.singleRecord({where: {user_id: data[i].user_id}})
    if(userD && (userD.commission === null || userD.commission === 'null')){
      defaultFeeData[0].commission = await helper.getCommission(getCarCount)
    } else if(userD && (userD.commission === 0 || userD.commission === '0.00')){
      defaultFeeData[0].commission = defaultFeeData[0].commission = await helper.getCommission(getCarCount)
    } else {
      defaultFeeData[0].commission = userD.commission
    }
    data[i].credit_consumed =  parseFloat(data[i].amount) - parseFloat(userD.credit)

    data[i].vat_percentage = defaultFeeData[0].vat
    data[i].commission_percent = defaultFeeData[0].commission
    data[i].commission_amount = (parseFloat(data[i].credit_consumed) * parseFloat( defaultFeeData[0].commission))/100
    data[i].vat = (parseFloat(data[i].credit_consumed) * parseFloat(defaultFeeData[0].vat))/100
    data[i].total = parseFloat(data[i].amount ) + parseInt(data[i].vat)
    data[i].start_date = start + ' 00:00:00'
    data[i].end_date = end + ' 23:59:59'   
    let obj = await invoice.createRecord(data[i])
    if(obj){
      await mail.monthlyInvoice(userD, data[i].month, obj)
     }
  }
  res.send({message: 'send'})
  console.log(`${data} successfully run the job`)
  } catch (e) {
    console.log({e})
    res.status(500).json({message : `Server Side Error ${e}`})
  }
}



exports.AddCompanyUser = async (req, res) => {
  try {
    let body = req.body;
    let query = {};
  query.where = {
      email: body.email,
    };
    let emailChecking = await user.singleRecord(query);
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
    if (req.files && req.files.profile_pic){
      let proTime = new Date().getTime() / 1000;
      await fileUpload(req.files.profile_pic, `${proTime}profile`);
      body.profile_pic = `./images/${proTime}profile.jpg`;
    }
    if (req.files && req.files.vat_registration_certificate ){
      let vat = req.files.vat_registration_certificate
      let vatTime = new Date().getTime() / 1000;
      await fileUploadPdf(vat, `${vatTime}vat`);
      body.vat_registration_certificate = `./pdf/${vatTime}vat.pdf`;
    }
    if (req.files && req.files.company_logo ){
      let logo = req.files.company_logo
      let logoTime = new Date().getTime() / 1000;
      await fileUpload(logo, `${logoTime}logo`);
      body.company_logo = `./images/${logoTime}logo.jpg`;
    }
    if (req.files && req.files.commercial_registration_certificate){
      let path = req.files.commercial_registration_certificate
      let pathTime = new Date().getTime() / 1000;
      await fileUploadPdf(path, `${pathTime}commercial_registration_certificate`);
      body.commercial_registration_certificate = `./pdf/${pathTime}commercial_registration_certificate.pdf`;
     
    }  
    let userD = await user.createRecord(body);
    let jwt = await helper.jwtToken(user.user_id);
    res.setHeader("token", `Bearer ${jwt}`);
    userD.jwtToken = jwt;
    userD = userD.toJSON();
    delete userD.password;
    // sending email
    if(body.user_type === USER_TYPE.user) {
      await mail.signup(body.f_name, body.l_name, userD, jwt, body.email, plainPassword)
    }
    res.send(userD);
  } catch (error) {
    console.log({ error });
    res.status(500).json({message: {en: 'Server side error', ar: 'خطأ من جانب الخادم'}});
  }
};