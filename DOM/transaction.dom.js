const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.transaction.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.transaction.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAlltransactions = async(query)=> {
    try {
        let data = await db.transaction.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.transaction.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.countRecord = async (query) => {
    try {
        let data = await db.transaction.count(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.removeRecord = async (query) => {
    try {
        let data = await db.transaction.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

