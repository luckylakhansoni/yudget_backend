const db = require("../models");

module.exports.createRecord = async (query) => {
  try {
    let data = await db.vatBill.create(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.singleRecord = async (query) => {
  try {
    let data = await db.vatBill.findOne(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateRecord = async (body, query) => {
  try {
    let data = await db.vatBill.update(body, query);
    return data;
  } catch (error) {
    throw error;
  }
};


module.exports.deleteRecord = async (query) => {
  try {
    let data = await db.vatBill.destroy(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findAllRecord = async (query) => {
  try {
    let data = await db.vatBill.findAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.findAndCount = async (query) => {
  try {
    let data = await db.vatBill.findAndCountAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.recordCount = async(query)=> {
  try {
      let data = await db.vatBill.count(query)
      return data
  } catch (error) {
      throw error
  }
}
