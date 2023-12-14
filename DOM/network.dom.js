const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.network.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.network.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllnetwork = async(query)=> {
    try {
        let data = await db.network.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.network.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.network.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.network.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.bulCreateRecord = async (body) => {
    try {
        let data = await db.network.bulkCreate(body, {
            returning: true
        })
        return data
    } catch (error) {
        throw error
    }
}

