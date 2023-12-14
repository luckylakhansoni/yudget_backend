const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.home.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.home.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllRecord = async(query)=> {
    try {
        let data = await db.home.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.home.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.home.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.home.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}

