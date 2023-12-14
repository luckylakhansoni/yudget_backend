const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const { JWT } = require("../utils/constant");
var nodemailer = require("nodemailer");
const package = require("../DOM/package.dom");
const emailConfig = require("../config/db.config.js");



let smtpTransport = nodemailer.createTransport({
  service: emailConfig.service,
  auth: {
    user: emailConfig.userName,
    pass: emailConfig.EmailPassword,
  },
});

module.exports.emailsend = function (email) {
  const data01 = smtpTransport.sendMail(
    {
      from: emailConfig.service, // sender address
      to: email.to, // list of receivers
      subject: email.subject, // Subject line
      text: email.text, // plaintext body
      html: email.html, // html body
    },
    function (err, res) {
      if (err) {
        console.log({err});
      } else {
        console.log({res})
        return res;
      }
    }
  );
  return data01;
};

exports.jwtToken = async (id, type) => {
  if (type === "station_emp") {
    return jwt.sign({ station_id: id }, JWT.tokenString, { expiresIn: "1d" });
  }
  if (type === "branch_user") {
    return jwt.sign({ branch_id: id }, JWT.tokenString, { expiresIn: "1d" });
  }
  return jwt.sign({ user_id: id, isBranch: true }, JWT.tokenString, {
    expiresIn: "1d",
  });
};

exports.createPassword = async (password) => {
  return Bcrypt.hashSync(password, 10);
};
exports.createStationId = async () => {
  return Math.floor(1000 + Math.random() * 9000);
};

module.exports.fileUpload = async (file, fileName) => {
  file.mv(`./public/images/${fileName}.jpg`, (err) => {
    if (err) {
      console.log({ error });
      throw err;
    }
  });
  return true;
};
exports.csvUpload = async (file, fileName) => {
  return new Promise((resolve, reject) => {
    file.mv(`./public/images/${fileName}.csv`, (err) => {
      if (err) {
        console.log({ error });
        return reject(err);
      }
    });
    return resolve(true);
  });
};

module.exports.fileUploadPdf = async (file, fileName) => {
  file.mv(`./public/pdf/${fileName}.pdf`, (err) => {
    if (err) {
      console.log({ err });
      throw err;
    }
  });
  return true;
};
module.exports.percentage = async (total, score) => {
  let x = (parseInt(score) * 100) / parseInt(total);
  return x;
};

module.exports.properGraph = async (graph) => {
  if (graph) {
    graph = JSON.parse(JSON.stringify(graph));
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let l = 1; l <= 12; l++) {
      const index = graph.findIndex((b) => b.month_number == l);
      if (index == -1) {
        graph.push({
          month_number: l,
          sum: 0,
          month: months[l - 1],
          year: new Date().getFullYear(),
        });
      }
    }
    graph.sort(($0, $1) => {
      return $0.month_number - $1.month_number;
    });
    return graph;
  }
  return [];
};

module.exports.properGraphInvoice = async (graph, year) => {
  if (graph) {
    graph = JSON.parse(JSON.stringify(graph));
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let l = 1; l <= 12; l++) {
      const index = graph.findIndex((b) => b.month_number == l);
      if (index == -1) {
        graph.push({
          month_number: l,
          sum: 0,
          month: months[l - 1] + "-" + year,
        });
      }
    }
    graph.sort(($0, $1) => {
      return $0.month_number - $1.month_number;
    });
    return graph;
  }
  return [];
};

module.exports.getCommission = async (value) => {
  try {
    let number = parseInt(value)
    let array = await package.findAllRecord({ where: { isActive: true } });
    let isValueFine = false
    let resultData

    if (array.length) {
      for (let i = 0; i < array.length; i++) {
        if(array[i].min <= number && array[i].max >= number) {
          isValueFine = true
          resultData = array[i].fee
          break; 
        }
      }
      if(isValueFine) {
       return resultData
      } else {
          return 0
      }
    }
  } catch (e) {
    throw e;
  }
};


module.exports.properGraphForAdmin = async (graph) => {
  if (graph) {
    graph = JSON.parse(JSON.stringify(graph));
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let l = 1; l <= 12; l++) {
      const index = graph.findIndex((b) => b.month_number == l);
      if (index == -1) {
        graph.push({
          month_number: l,
          month: months[l - 1] ,
          commission: 0,
          count: 0,
        });
      }
    }
    graph.sort(($0, $1) => {
      return $0.month_number - $1.month_number;
    });
    return graph;
  }
  return [];
};