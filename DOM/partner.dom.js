const db = require("../models");
module.exports.createRecord = async (query)=>{
    try {
        let data = await db.parnter.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.parnter.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.parnter.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeUser = async (query) => {
    try {
        let data = await db.parnter.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllParnter = async(query)=> {
    try {
        let data = await db.parnter.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteUser = async(query)=> {
    try {
        let data = await db.parnter.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.parnter.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}