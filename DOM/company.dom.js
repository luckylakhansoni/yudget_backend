const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.company.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.company.findOne(query)
        return data
    } catch (error) {
        throw error
    }
 }

module.exports.findAllcompany = async(query)=> {
    try {
        let data = await db.company.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.company.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.company.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.recordCount = async(query)=> {
    try {
        let data = await db.company.count(query)
        return data
    } catch (error) {
        throw error
    }
}
