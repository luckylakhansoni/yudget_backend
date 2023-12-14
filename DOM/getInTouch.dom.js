const db = require("../models");
module.exports.createRecord = async (query)=>{
    try {
        let data = await db.getInTouch.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.getInTouch.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.getInTouch.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeUser = async (query) => {
    try {
        let data = await db.getInTouch.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllParnter = async(query)=> {
    try {
        let data = await db.getInTouch.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.getInTouch.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.getInTouch.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}