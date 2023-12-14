const db = require("../models");

module.exports.createRecord = async (query) => {
  try {
    let data = await db.district.create(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.singleRecord = async (query) => {
  try {
    let data = await db.district.findOne(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateRecord = async (body, query) => {
  try {
    let data = await db.district.update(body, query);
    return data;
  } catch (error) {
    throw error;
  }
};


module.exports.deleteRecord = async (query) => {
  try {
    let data = await db.district.destroy(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findAllRecord = async (query) => {
  try {
    let data = await db.district.findAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.findAndCount = async (query) => {
  try {
    let data = await db.district.findAndCountAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.bulCreateRecord = async (body) => {
  try {
      let data = await db.district.bulkCreate(body, {
          returning: true
      })
      return data
  } catch (error) {
      throw error
  }
}
