const db = require("../models");
module.exports.createRecord = async (query)=>{
    try {
        let data = await db.privacy.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.privacy.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.privacy.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeUser = async (query) => {
    try {
        let data = await db.privacy.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllParnter = async(query)=> {
    try {
        let data = await db.privacy.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.privacy.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.privacy.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}