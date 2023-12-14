const db = require("../models");

module.exports.createRecord = async (query) => {
  try {
    let data = await db.brand.create(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.singleRecord = async (query) => {
  try {
    let data = await db.brand.findOne(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateRecord = async (body, query) => {
  try {
    let data = await db.brand.update(body, query);
    return data;
  } catch (error) {
    throw error;
  }
};


module.exports.deleteRecord = async (query) => {
  try {
    let data = await db.brand.destroy(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findAllRecord = async (query) => {
  try {
    let data = await db.brand.findAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.findAndCount = async (query) => {
  try {
    let data = await db.brand.findAndCountAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
