const { branch } = require("../models");
const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.branch.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.branch.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllBranches = async(query)=> {
    try {
        let data = await db.branch.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.branch.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.removeRecord = async (query) => {
    try {
        let data = await db.branch.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.bulkUpdate = async(array)=> {
    try {
        let data = await branch.bulkCreate(array, {updateOnDuplicate : ['branch_id', 'credit'] })
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.branch.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.recordCount = async(query)=> {
    try {
        let data = await db.branch.count(query)
        return data
    } catch (error) {
        throw error
    }
}

