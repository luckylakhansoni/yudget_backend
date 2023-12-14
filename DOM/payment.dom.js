const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.payment.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.payment.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllpayments = async(query)=> {
    try {
        let data = await db.payment.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.payment.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.countRecord = async (query) => {
    try {
        let data = await db.payment.count(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.removeRecord = async (query) => {
    try {
        let data = await db.payment.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

