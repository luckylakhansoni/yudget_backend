const db = require("../models");

module.exports.createRecord = async (query)=>{
    try {
        let data = await db.adminTransaction.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.adminTransaction.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.adminTransaction.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeRecord = async (query) => {
    try {
        let data = await db.adminTransaction.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllRecords = async(query)=> {
    try {
        let data = await db.adminTransaction.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.adminTransaction.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.adminTransaction.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.recordCount = async(query)=> {
    try {
        let data = await db.adminTransaction.count(query)
        return data
    } catch (error) {
        throw error
    }
}

