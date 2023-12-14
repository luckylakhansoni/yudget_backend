const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.support.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.support.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllRecord = async(query)=> {
    try {
        let data = await db.support.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.support.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.support.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.recordCount = async(query)=> {
    try {
        let data = await db.support.count(query)
        return data
    } catch (error) {
        throw error
    }
}

