const db = require("../models");

module.exports.createRecord = async (query) => {
  try {
    let data = await db.city.create(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.singleRecord = async (query) => {
  try {
    let data = await db.city.findOne(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateRecord = async (body, query) => {
  try {
    let data = await db.city.update(body, query);
    return data;
  } catch (error) {
    throw error;
  }
};


module.exports.deleteRecord = async (query) => {
  try {
    let data = await db.city.destroy(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findAllRecord = async (query) => {
  try {
    let data = await db.city.findAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.findAndCount = async (query) => {
  try {
    let data = await db.city.findAndCountAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
