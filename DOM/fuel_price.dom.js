const db = require("../models");

module.exports.createRecord = async (query) => {
  try {
    let data = await db.fuelPrice.create(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.singleRecord = async (query) => {
  try {
    let data = await db.fuelPrice.findOne(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateRecord = async (body, query) => {
  try {
    let data = await db.fuelPrice.update(body, query);
    return data;
  } catch (error) {
    throw error;
  }
};


module.exports.deleteRecord = async (query) => {
  try {
    let data = await db.fuelPrice.destroy(query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findAllRecord = async (query) => {
  try {
    let data = await db.fuelPrice.findAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports.findAndCount = async (query) => {
  try {
    let data = await db.fuelPrice.findAndCountAll(query);
    return data;
  } catch (error) {
    throw error;
  }
};
