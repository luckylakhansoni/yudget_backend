const db = require("../models");

module.exports.createRecord = async (query)=>{
    try {
        let data = await db.contact.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.contact.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.contact.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeUser = async (query) => {
    try {
        let data = await db.contact.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllUsers = async(query)=> {
    try {
        let data = await db.contact.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.contact.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}


module.exports.findAllUsers = async(query)=> {
    try {
        let data = await db.contact.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.contact.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}
