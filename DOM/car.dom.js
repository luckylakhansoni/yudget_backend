const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.car.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.car.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllcars = async(query)=> {
    try {
        let data = await db.car.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.car.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.removeRecord = async (query) => {
    try {
        let data = await db.car.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.car.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.bulCreateRecord = async (body) => {
    try {
        let data = await db.car.bulkCreate(body, {
            returning: true
        })
        return data
    } catch (error) {
        throw error
    }
}

module.exports.countRecord = async (body) => {
    try {
        let data = await db.car.count(body)
        return data
    } catch (error) {
        throw error
    }
}