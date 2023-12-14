const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.package.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.package.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllRecord = async(query)=> {
    try {
        let data = await db.package.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.package.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.removeRecord = async (query) => {
    try {
        let data = await db.package.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.bulkUpdateRecord = async(array)=> {
    try {
        let data = await defaultFee.bulkCreate(array, {updateOnDuplicate : ['branch_id', 'credit'] })
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.package.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.recordCount = async(query)=> {
    try {
        let data = await db.package.count(query)
        return data
    } catch (error) {
        throw error
    }
}
