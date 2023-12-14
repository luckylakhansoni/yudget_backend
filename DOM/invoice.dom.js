const db = require("../models");

module.exports.createRecord = async (query)=>{
    try {
        let data = await db.invoice.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.invoice.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.invoice.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeUser = async (query) => {
    try {
        let data = await db.invoice.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllUsers = async(query)=> {
    try {
        let data = await db.invoice.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteUser = async(query)=> {
    try {
        let data = await db.invoice.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}


module.exports.findAllUsers = async(query)=> {
    try {
        let data = await db.invoice.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.invoice.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.recordCount = async(query)=> {
    try {
        let data = await db.invoice.count(query)
        return data
    } catch (error) {
        throw error
    }
}

