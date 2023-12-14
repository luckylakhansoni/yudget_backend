const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.image.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.image.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllimages = async(query)=> {
    try {
        let data = await db.image.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.image.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllcount = async(query)=> {
    try {
        let data = await db.image.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.image.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.recordCount = async(query)=> {
    try {
        let data = await db.image.count(query)
        return data
    } catch (error) {
        throw error
    }
}
